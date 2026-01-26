import { App } from "aws-cdk-lib";
import * as fs from "fs";
import * as path from "path";
import { DocumentDbStack } from "../lib/documentdb-stack";
import { EcsApiStack } from "../lib/ecs-api-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { NetworkStack } from "../lib/network-stack";
import { PipelineStack } from "../lib/pipeline-stack";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const app = new App();

const envName = required("ENV_NAME");
const awsAccount = required("CDK_DEFAULT_ACCOUNT");
const awsRegion = required("CDK_DEFAULT_REGION");

type AppConfig = {
  namePrefix: string;
  tags: Record<string, string>;
  vpc: {
    cidr: string;
    publicSubnetCidrs: string[];
    privateSubnetCidrs: string[];
  };
  documentdb: {
    dbName: string;
    dbUsername: string;
    dbPassword: string;
    instanceClass: string;
    clusterSize: number;
  };
  ecsApi: {
    containerPort: number;
    desiredCount: number;
    clientUrl: string;
    jwtSecretArn: string;
  };
  frontend: {
    domainName: string;
    hostedZoneName: string;
  };
  pipeline: {
    codestarConnectionArn: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
    reactAppApiUrl: string;
    reactAppHost: string;
  };
};

function loadConfig(name: string): AppConfig {
  const configDir = process.env.CONFIG_DIR || path.resolve(process.cwd(), "config");
  const configPath = path.resolve(configDir, `${name}.json`);
  const raw = fs.readFileSync(configPath, "utf8");
  return JSON.parse(raw) as AppConfig;
}

const config = loadConfig(envName);

const network = new NetworkStack(app, `${envName}-network`, {
  env: { account: awsAccount, region: awsRegion },
  namePrefix: config.namePrefix,
  vpcCidr: config.vpc.cidr,
  publicSubnetCidrs: config.vpc.publicSubnetCidrs,
  privateSubnetCidrs: config.vpc.privateSubnetCidrs,
  tags: config.tags,
});

const documentdb = new DocumentDbStack(app, `${envName}-documentdb`, {
  env: { account: awsAccount, region: awsRegion },
  namePrefix: config.namePrefix,
  vpcId: network.vpcId,
  availabilityZones: network.azs,
  privateSubnetIds: network.privateSubnetIds,
  dbName: config.documentdb.dbName,
  dbUsername: config.documentdb.dbUsername,
  dbPassword: config.documentdb.dbPassword,
  instanceClass: config.documentdb.instanceClass,
  clusterSize: config.documentdb.clusterSize,
  tags: config.tags,
});

const ecsApi = new EcsApiStack(app, `${envName}-ecs-api`, {
  env: { account: awsAccount, region: awsRegion },
  namePrefix: config.namePrefix,
  vpcId: network.vpcId,
  availabilityZones: network.azs,
  publicSubnetIds: network.publicSubnetIds,
  privateSubnetIds: network.privateSubnetIds,
  containerPort: config.ecsApi.containerPort,
  desiredCount: config.ecsApi.desiredCount,
  envName,
  clientUrl: config.ecsApi.clientUrl,
  mongoUriSecretArn: documentdb.mongoUriSecretArn,
  jwtSecretArn: config.ecsApi.jwtSecretArn,
  docdbSgId: documentdb.docdbSgId,
  tags: config.tags,
});

const frontend = new FrontendStack(app, `${envName}-frontend`, {
  env: { account: awsAccount, region: awsRegion },
  namePrefix: config.namePrefix,
  domainName: config.frontend.domainName,
  hostedZoneName: config.frontend.hostedZoneName,
  tags: config.tags,
});

new PipelineStack(app, `${envName}-pipeline`, {
  env: { account: awsAccount, region: awsRegion },
  namePrefix: config.namePrefix,
  codestarConnectionArn: config.pipeline.codestarConnectionArn,
  repoOwner: config.pipeline.repoOwner,
  repoName: config.pipeline.repoName,
  repoBranch: config.pipeline.repoBranch,
  ecrRepoUrl: ecsApi.ecrRepoUrl,
  ecsClusterName: ecsApi.ecsClusterName,
  ecsServiceName: ecsApi.ecsServiceName,
  ecsContainerName: ecsApi.ecsContainerName,
  webBucketName: frontend.webBucketName,
  cloudfrontDistributionId: frontend.cloudfrontDistributionId,
  reactAppApiUrl: config.pipeline.reactAppApiUrl,
  reactAppHost: config.pipeline.reactAppHost,
  tags: config.tags,
});
