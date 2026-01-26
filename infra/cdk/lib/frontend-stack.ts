import { CfnOutput, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface FrontendStackProps extends StackProps {
  namePrefix: string;
  domainName: string;
  hostedZoneName: string;
  tags: Record<string, string>;
}

export class FrontendStack extends Stack {
  public readonly webBucketName: string;
  public readonly cloudfrontDistributionId: string;
  public readonly cloudfrontDomainName: string;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const bucket = new s3.CfnBucket(this, "WebBucket", {
      bucketName: `${props.namePrefix}-web`,
      publicAccessBlockConfiguration: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
    });

    const oac = new cloudfront.CfnOriginAccessControl(this, "WebOac", {
      originAccessControlConfig: {
        name: `${props.namePrefix}-oac`,
        description: `OAC for ${props.namePrefix}`,
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    });

    const distribution = new cloudfront.CfnDistribution(this, "WebDistribution", {
      distributionConfig: {
        enabled: true,
        defaultRootObject: "index.html",
        origins: [
          {
            id: "s3-web",
            domainName: bucket.attrRegionalDomainName,
            originAccessControlId: oac.ref,
            s3OriginConfig: {},
          },
        ],
        defaultCacheBehavior: {
          allowedMethods: ["GET", "HEAD", "OPTIONS"],
          cachedMethods: ["GET", "HEAD", "OPTIONS"],
          targetOriginId: "s3-web",
          viewerProtocolPolicy: "redirect-to-https",
          forwardedValues: {
            queryString: false,
            cookies: { forward: "none" },
          },
        },
        customErrorResponses: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: "/index.html",
            errorCachingMinTtl: 0,
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
            errorCachingMinTtl: 0,
          },
        ],
        restrictions: {
          geoRestriction: { restrictionType: "none" },
        },
        viewerCertificate: {
          cloudFrontDefaultCertificate: true,
        },
      },
    });
    const distributionArn = Stack.of(this).formatArn({
      service: "cloudfront",
      region: "",
      resource: "distribution",
      resourceName: distribution.attrId,
    });

    new s3.CfnBucketPolicy(this, "WebBucketPolicy", {
      bucket: bucket.ref,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AllowCloudFrontRead",
            Effect: "Allow",
            Principal: { Service: "cloudfront.amazonaws.com" },
            Action: ["s3:GetObject"],
            Resource: [`${bucket.attrArn}/*`],
            Condition: {
              StringEquals: {
                "AWS:SourceArn": distributionArn,
              },
            },
          },
        ],
      },
    });

    for (const [key, value] of Object.entries(props.tags)) {
      Tags.of(this).add(key, value);
    }

    this.webBucketName = bucket.ref;
    this.cloudfrontDistributionId = distribution.ref;
    this.cloudfrontDomainName = distribution.attrDomainName;

    new CfnOutput(this, "WebBucketName", { value: this.webBucketName });
    new CfnOutput(this, "CloudFrontDistributionId", {
      value: this.cloudfrontDistributionId,
    });
    new CfnOutput(this, "CloudFrontDomainName", {
      value: this.cloudfrontDomainName,
    });
  }
}
