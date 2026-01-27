import { CfnOutput, Duration, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export interface EcsApiStackProps extends StackProps {
  namePrefix: string;
  vpcId: string;
  availabilityZones: string[];
  publicSubnetIds: string[];
  privateSubnetIds: string[];
  containerPort: number;
  desiredCount: number;
  envName: string;
  clientUrl: string;
  apiDomainName?: string;
  apiHostedZoneName?: string;
  apiCertificateArn?: string;
  apiCloudfrontEnabled?: boolean;
  mongoUriSecretArn: string;
  jwtSecretArn: string;
  docdbSgId: string;
  tags: Record<string, string>;
}

export class EcsApiStack extends Stack {
  public readonly ecrRepoUrl: string;
  public readonly ecsClusterName: string;
  public readonly ecsServiceName: string;
  public readonly ecsContainerName: string;
  public readonly albDnsName: string;
  public readonly serviceSgId: string;

  constructor(scope: Construct, id: string, props: EcsApiStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, "Vpc", {
      vpcId: props.vpcId,
      availabilityZones: props.availabilityZones,
      publicSubnetIds: props.publicSubnetIds,
      privateSubnetIds: props.privateSubnetIds,
    });

    const publicSubnets = props.publicSubnetIds.map((subnetId, index) =>
      ec2.Subnet.fromSubnetId(this, `PublicSubnet${index + 1}`, subnetId),
    );
    const privateSubnets = props.privateSubnetIds.map((subnetId, index) =>
      ec2.Subnet.fromSubnetId(this, `PrivateSubnet${index + 1}`, subnetId),
    );

    const repo = new ecr.Repository(this, "ApiRepo", {
      repositoryName: `${props.namePrefix}-api`,
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      clusterName: `${props.namePrefix}-cluster`,
      vpc,
    });

    const logGroup = new logs.LogGroup(this, "ApiLogGroup", {
      logGroupName: `/ecs/${props.namePrefix}-api`,
      retention: logs.RetentionDays.TWO_WEEKS,
    });

    const taskExecutionRole = new iam.Role(this, "TaskExecutionRole", {
      roleName: `${props.namePrefix}-ecs-exec`,
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });
    taskExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy",
      ),
    );
    taskExecutionRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [props.mongoUriSecretArn, props.jwtSecretArn],
      }),
    );

    const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
      family: `${props.namePrefix}-api`,
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: taskExecutionRole,
    });

    const fromArn = (id: string, arn: string) =>
      /-[a-zA-Z0-9]{6}$/.test(arn)
        ? secretsmanager.Secret.fromSecretCompleteArn(this, id, arn)
        : secretsmanager.Secret.fromSecretPartialArn(this, id, arn);

    const mongoSecret = fromArn("MongoUriSecret", props.mongoUriSecretArn);
    const jwtSecret = fromArn("JwtSecret", props.jwtSecretArn);

    const container = taskDef.addContainer("ApiContainer", {
      containerName: "api",
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      essential: true,
      logging: ecs.LogDrivers.awsLogs({
        logGroup,
        streamPrefix: "ecs",
      }),
      environment: {
        PORT: `${props.containerPort}`,
        NODE_ENV: "production",
        ENVIRONMENT: props.envName,
        CLIENT_URLS: props.clientUrl,
        CLIENT_URL: props.clientUrl,
        CLIENT: props.clientUrl,
      },
      secrets: {
        MONGO_URI: ecs.Secret.fromSecretsManager(mongoSecret),
        JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
      },
    });
    container.addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.containerPort,
      protocol: ecs.Protocol.TCP,
    });

    const albSg = new ec2.SecurityGroup(this, "AlbSg", {
      vpc,
      securityGroupName: `${props.namePrefix}-alb-sg`,
      description: "ALB security group",
      allowAllOutbound: true,
    });
    albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));

    const serviceSg = new ec2.SecurityGroup(this, "ServiceSg", {
      vpc,
      securityGroupName: `${props.namePrefix}-svc-sg`,
      description: "ECS service security group",
      allowAllOutbound: true,
    });
    serviceSg.addIngressRule(albSg, ec2.Port.tcp(props.containerPort));

    const docdbSg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "DocDbSg",
      props.docdbSgId,
      { mutable: true },
    );
    docdbSg.addIngressRule(serviceSg, ec2.Port.tcp(27017));

    const alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc,
      internetFacing: true,
      securityGroup: albSg,
      loadBalancerName: `${props.namePrefix}-alb`,
      vpcSubnets: { subnets: publicSubnets },
    });

    const targetGroup = new elbv2.ApplicationTargetGroup(this, "ApiTg", {
      vpc,
      targetGroupName: `${props.namePrefix}-tg`,
      port: props.containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: "/health",
        healthyHttpCodes: "200-399",
        interval: Duration.seconds(30),
        timeout: Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
    });

    const apiDomainName = props.apiDomainName?.trim();
    const apiHostedZoneName = props.apiHostedZoneName?.trim();
    const apiCertificateArn = props.apiCertificateArn?.trim();

    let httpsListener: elbv2.ApplicationListener | undefined;

    if (apiDomainName && apiHostedZoneName) {
      const hostedZone = route53.HostedZone.fromLookup(this, "ApiHostedZone", {
        domainName: apiHostedZoneName,
      });

      const certificate = apiCertificateArn
        ? acm.Certificate.fromCertificateArn(this, "ApiCert", apiCertificateArn)
        : new acm.Certificate(this, "ApiCert", {
            domainName: apiDomainName,
            validation: acm.CertificateValidation.fromDns(hostedZone),
          });

      httpsListener = alb.addListener("HttpsListener", {
        port: 443,
        protocol: elbv2.ApplicationProtocol.HTTPS,
        certificates: [certificate],
        defaultAction: elbv2.ListenerAction.forward([targetGroup]),
      });

      new route53.ARecord(this, "ApiAliasRecord", {
        zone: hostedZone,
        recordName: apiDomainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.LoadBalancerTarget(alb),
        ),
      });
      new route53.AaaaRecord(this, "ApiAliasRecordIpv6", {
        zone: hostedZone,
        recordName: apiDomainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.LoadBalancerTarget(alb),
        ),
      });
    }

    const httpListener = alb.addListener("HttpListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: httpsListener
        ? elbv2.ListenerAction.redirect({ protocol: "HTTPS", port: "443" })
        : elbv2.ListenerAction.forward([targetGroup]),
    });

    const service = new ecs.FargateService(this, "Service", {
      serviceName: `${props.namePrefix}-api`,
      cluster,
      taskDefinition: taskDef,
      desiredCount: props.desiredCount,
      assignPublicIp: false,
      securityGroups: [serviceSg],
      vpcSubnets: { subnets: privateSubnets },
    });
    service.attachToApplicationTargetGroup(targetGroup);
    service.node.addDependency(httpListener);
    if (httpsListener) {
      service.node.addDependency(httpsListener);
    }

    for (const [key, value] of Object.entries(props.tags)) {
      Tags.of(this).add(key, value);
    }

    this.ecrRepoUrl = repo.repositoryUri;
    this.ecsClusterName = cluster.clusterName;
    this.ecsServiceName = service.serviceName;
    this.ecsContainerName = "api";
    this.albDnsName = alb.loadBalancerDnsName;
    this.serviceSgId = serviceSg.securityGroupId;

    new CfnOutput(this, "EcrRepoUrl", { value: this.ecrRepoUrl });
    new CfnOutput(this, "EcsClusterName", { value: this.ecsClusterName });
    new CfnOutput(this, "EcsServiceName", { value: this.ecsServiceName });
    new CfnOutput(this, "EcsContainerName", { value: this.ecsContainerName });
    new CfnOutput(this, "AlbDnsName", { value: this.albDnsName });
    new CfnOutput(this, "ServiceSgId", { value: this.serviceSgId });

    if (props.apiCloudfrontEnabled) {
      const apiDistribution = new cloudfront.CfnDistribution(
        this,
        "ApiDistribution",
        {
          distributionConfig: {
            enabled: true,
            origins: [
              {
                id: "alb-api",
                domainName: this.albDnsName,
                customOriginConfig: {
                  originProtocolPolicy: "http-only",
                  httpPort: 80,
                  httpsPort: 443,
                  originSslProtocols: ["TLSv1.2"],
                },
              },
            ],
            defaultCacheBehavior: {
              targetOriginId: "alb-api",
              viewerProtocolPolicy: "redirect-to-https",
              allowedMethods: [
                "GET",
                "HEAD",
                "OPTIONS",
                "PUT",
                "POST",
                "PATCH",
                "DELETE",
              ],
              cachedMethods: ["GET", "HEAD", "OPTIONS"],
              compress: true,
              forwardedValues: {
                queryString: true,
                headers: ["*"],
                cookies: { forward: "all" },
              },
              minTtl: 0,
              defaultTtl: 0,
              maxTtl: 0,
            },
            viewerCertificate: {
              cloudFrontDefaultCertificate: true,
            },
          },
        },
      );

      new CfnOutput(this, "ApiCloudFrontDomainName", {
        value: apiDistribution.attrDomainName,
      });
      new CfnOutput(this, "ApiCloudFrontDistributionId", {
        value: apiDistribution.ref,
      });
    }
  }
}
