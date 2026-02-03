import { CfnOutput, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface PipelineStackProps extends StackProps {
  namePrefix: string;
  codestarConnectionArn: string;
  repoOwner: string;
  repoName: string;
  repoBranch: string;
  ecrRepoUrl: string;
  ecsClusterName: string;
  ecsServiceName: string;
  ecsContainerName: string;
  webBucketName: string;
  cloudfrontDistributionId: string;
  reactAppApiUrl: string;
  reactAppHost: string;
  tags: Record<string, string>;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const artifactsBucket = new s3.CfnBucket(this, "ArtifactsBucket", {
      bucketName: `${props.namePrefix}-pipeline-artifacts`,
      publicAccessBlockConfiguration: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
    });

    const codepipelineRole = new iam.Role(this, "CodePipelineRole", {
      roleName: `${props.namePrefix}-codepipeline-role`,
      assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
    });

    codepipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject",
          "s3:ListBucket",
        ],
        resources: [
          artifactsBucket.attrArn,
          `${artifactsBucket.attrArn}/*`,
        ],
      }),
    );
    codepipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["codebuild:BatchGetBuilds", "codebuild:StartBuild"],
        resources: ["*"],
      }),
    );
    codepipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["codestar-connections:UseConnection"],
        resources: [props.codestarConnectionArn],
      }),
    );
    codepipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ecs:DescribeServices", "ecs:UpdateService"],
        resources: ["*"],
      }),
    );
    codepipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["iam:PassRole"],
        resources: ["*"],
      }),
    );

    const codebuildApiRole = new iam.Role(this, "CodeBuildApiRole", {
      roleName: `${props.namePrefix}-codebuild-api`,
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
    });
    codebuildApiRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
        ],
        resources: ["*"],
      }),
    );
    codebuildApiRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        resources: ["*"],
      }),
    );

    const codebuildWebRole = new iam.Role(this, "CodeBuildWebRole", {
      roleName: `${props.namePrefix}-codebuild-web`,
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
    });
    codebuildWebRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
        resources: [
          `arn:aws:s3:::${props.webBucketName}`,
          `arn:aws:s3:::${props.webBucketName}/*`,
        ],
      }),
    );
    codebuildWebRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: ["*"],
      }),
    );
    codebuildWebRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        resources: ["*"],
      }),
    );

    const apiProject = new codebuild.CfnProject(this, "ApiBuildProject", {
      name: `${props.namePrefix}-api-build`,
      serviceRole: codebuildApiRole.roleArn,
      artifacts: { type: "CODEPIPELINE" },
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        image: "aws/codebuild/standard:7.0",
        type: "LINUX_CONTAINER",
        privilegedMode: true,
        environmentVariables: [
          { name: "AWS_REGION", value: Stack.of(this).region },
          { name: "ECR_REPO", value: props.ecrRepoUrl },
          { name: "ECS_CONTAINER_NAME", value: props.ecsContainerName },
        ],
      },
      source: {
        type: "CODEPIPELINE",
        buildSpec: "infra/buildspecs/api.yml",
      },
    });

    const webProject = new codebuild.CfnProject(this, "WebBuildProject", {
      name: `${props.namePrefix}-web-build`,
      serviceRole: codebuildWebRole.roleArn,
      artifacts: { type: "CODEPIPELINE" },
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        image: "aws/codebuild/standard:7.0",
        type: "LINUX_CONTAINER",
        privilegedMode: false,
        environmentVariables: [
          { name: "AWS_REGION", value: Stack.of(this).region },
          { name: "WEB_BUCKET", value: props.webBucketName },
          { name: "CLOUDFRONT_DISTRIBUTION_ID", value: props.cloudfrontDistributionId },
          { name: "REACT_APP_API_URL", value: props.reactAppApiUrl },
          { name: "REACT_APP_HOST", value: props.reactAppHost },
        ],
      },
      source: {
        type: "CODEPIPELINE",
        buildSpec: "infra/buildspecs/web.yml",
      },
    });

    const apiPipeline = new codepipeline.CfnPipeline(this, "ApiPipeline", {
      name: `${props.namePrefix}-api-pipeline`,
      roleArn: codepipelineRole.roleArn,
      artifactStore: {
        location: artifactsBucket.ref,
        type: "S3",
      },
      stages: [
        {
          name: "Source",
          actions: [
            {
              name: "Source",
              actionTypeId: {
                category: "Source",
                owner: "AWS",
                provider: "CodeStarSourceConnection",
                version: "1",
              },
              outputArtifacts: [{ name: "source_output" }],
              configuration: {
                ConnectionArn: props.codestarConnectionArn,
                FullRepositoryId: `${props.repoOwner}/${props.repoName}`,
                BranchName: props.repoBranch,
                DetectChanges: "true",
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: "Build",
          actions: [
            {
              name: "Build",
              actionTypeId: {
                category: "Build",
                owner: "AWS",
                provider: "CodeBuild",
                version: "1",
              },
              inputArtifacts: [{ name: "source_output" }],
              outputArtifacts: [{ name: "build_output" }],
              configuration: {
                ProjectName: apiProject.ref,
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: "Deploy",
          actions: [
            {
              name: "Deploy",
              actionTypeId: {
                category: "Deploy",
                owner: "AWS",
                provider: "ECS",
                version: "1",
              },
              inputArtifacts: [{ name: "build_output" }],
              configuration: {
                ClusterName: props.ecsClusterName,
                ServiceName: props.ecsServiceName,
                FileName: "imagedefinitions.json",
              },
              runOrder: 1,
            },
          ],
        },
      ],
    });

    const webPipeline = new codepipeline.CfnPipeline(this, "WebPipeline", {
      name: `${props.namePrefix}-web-pipeline`,
      roleArn: codepipelineRole.roleArn,
      artifactStore: {
        location: artifactsBucket.ref,
        type: "S3",
      },
      stages: [
        {
          name: "Source",
          actions: [
            {
              name: "Source",
              actionTypeId: {
                category: "Source",
                owner: "AWS",
                provider: "CodeStarSourceConnection",
                version: "1",
              },
              outputArtifacts: [{ name: "source_output" }],
              configuration: {
                ConnectionArn: props.codestarConnectionArn,
                FullRepositoryId: `${props.repoOwner}/${props.repoName}`,
                BranchName: props.repoBranch,
                DetectChanges: "true",
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: "Build",
          actions: [
            {
              name: "Build",
              actionTypeId: {
                category: "Build",
                owner: "AWS",
                provider: "CodeBuild",
                version: "1",
              },
              inputArtifacts: [{ name: "source_output" }],
              outputArtifacts: [{ name: "build_output" }],
              configuration: {
                ProjectName: webProject.ref,
              },
              runOrder: 1,
            },
          ],
        },
      ],
    });

    for (const [key, value] of Object.entries(props.tags)) {
      Tags.of(this).add(key, value);
    }

    new CfnOutput(this, "ArtifactsBucketName", { value: artifactsBucket.ref });
    new CfnOutput(this, "ApiPipelineName", { value: apiPipeline.ref });
    new CfnOutput(this, "WebPipelineName", { value: webPipeline.ref });
  }
}
