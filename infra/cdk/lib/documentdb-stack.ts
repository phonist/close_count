import { CfnOutput, Fn, SecretValue, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as docdb from "aws-cdk-lib/aws-docdb";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export interface DocumentDbStackProps extends StackProps {
  namePrefix: string;
  vpcId: string;
  availabilityZones: string[];
  privateSubnetIds: string[];
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  instanceClass: string;
  clusterSize: number;
  tags: Record<string, string>;
}

export class DocumentDbStack extends Stack {
  public readonly mongoUriSecretArn: string;
  public readonly docdbEndpoint: string;
  public readonly docdbSgId: string;

  constructor(scope: Construct, id: string, props: DocumentDbStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, "Vpc", {
      vpcId: props.vpcId,
      availabilityZones: props.availabilityZones,
      privateSubnetIds: props.privateSubnetIds,
      publicSubnetIds: [],
    });

    const docdbSg = new ec2.SecurityGroup(this, "DocDbSg", {
      vpc,
      securityGroupName: `${props.namePrefix}-docdb-sg`,
      description: "DocumentDB security group",
      allowAllOutbound: true,
    });

    const subnetGroup = new docdb.CfnDBSubnetGroup(this, "DocDbSubnetGroup", {
      dbSubnetGroupName: `${props.namePrefix}-docdb-subnets`,
      subnetIds: props.privateSubnetIds,
      dbSubnetGroupDescription: "DocumentDB subnet group",
      tags: [{ key: "Name", value: `${props.namePrefix}-docdb-subnets` }],
    });

    const cluster = new docdb.CfnDBCluster(this, "DocDbCluster", {
      dbClusterIdentifier: `${props.namePrefix}-docdb`,
      masterUsername: props.dbUsername,
      masterUserPassword: props.dbPassword,
      dbSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [docdbSg.securityGroupId],
      backupRetentionPeriod: 7,
    });

    const instances = Array.from({ length: props.clusterSize }).map(
      (_, index) =>
        new docdb.CfnDBInstance(this, `DocDbInstance${index + 1}`, {
          dbClusterIdentifier: cluster.ref,
          dbInstanceIdentifier: `${props.namePrefix}-docdb-${index + 1}`,
          dbInstanceClass: props.instanceClass,
          tags: [
            { key: "Name", value: `${props.namePrefix}-docdb-${index + 1}` },
          ],
        }),
    );

    const mongoUri = Fn.join("", [
      "mongodb://",
      props.dbUsername,
      ":",
      props.dbPassword,
      "@",
      cluster.attrEndpoint,
      ":27017/",
      props.dbName,
      "?tls=true&tlsAllowInvalidHostnames=true&tlsAllowInvalidCertificates=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false",
    ]);

    const mongoSecret = new secretsmanager.Secret(this, "MongoUriSecret", {
      secretName: `${props.namePrefix}-mongo-uri`,
      secretStringValue: SecretValue.unsafePlainText(mongoUri),
    });

    for (const [key, value] of Object.entries(props.tags)) {
      Tags.of(this).add(key, value);
    }

    this.mongoUriSecretArn = mongoSecret.secretArn;
    this.docdbEndpoint = cluster.attrEndpoint;
    this.docdbSgId = docdbSg.securityGroupId;

    new CfnOutput(this, "MongoUriSecretArn", {
      value: this.mongoUriSecretArn,
    });
    new CfnOutput(this, "DocDbEndpoint", { value: this.docdbEndpoint });
    new CfnOutput(this, "DocDbSgId", { value: this.docdbSgId });

    instances.forEach((instance) => {
      instance.addDependency(cluster);
    });
  }
}
