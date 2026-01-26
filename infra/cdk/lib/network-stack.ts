import { CfnOutput, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Fn } from "aws-cdk-lib";

export interface NetworkStackProps extends StackProps {
  namePrefix: string;
  vpcCidr: string;
  publicSubnetCidrs: string[];
  privateSubnetCidrs: string[];
  tags: Record<string, string>;
}

export class NetworkStack extends Stack {
  public readonly vpcId: string;
  public readonly publicSubnetIds: string[];
  public readonly privateSubnetIds: string[];
  public readonly azs: string[];

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    if (props.publicSubnetCidrs.length === 0 || props.privateSubnetCidrs.length === 0) {
      throw new Error("Subnet CIDR lists must not be empty.");
    }
    if (props.publicSubnetCidrs.length !== props.privateSubnetCidrs.length) {
      throw new Error("Public and private subnet CIDR counts must match.");
    }
    const azs = Stack.of(this).availabilityZones.slice(
      0,
      props.publicSubnetCidrs.length,
    );
    this.azs = azs;

    const vpc = new ec2.CfnVPC(this, "Vpc", {
      cidrBlock: props.vpcCidr,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      tags: [{ key: "Name", value: `${props.namePrefix}-vpc` }],
    });

    const igw = new ec2.CfnInternetGateway(this, "Igw", {
      tags: [{ key: "Name", value: `${props.namePrefix}-igw` }],
    });
    new ec2.CfnVPCGatewayAttachment(this, "IgwAttachment", {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref,
    });

    const publicSubnets = props.publicSubnetCidrs.map((cidr, index) => {
      return new ec2.CfnSubnet(this, `PublicSubnet${index + 1}`, {
        vpcId: vpc.ref,
        cidrBlock: cidr,
        availabilityZone: Fn.select(index, azs),
        mapPublicIpOnLaunch: true,
        tags: [{ key: "Name", value: `${props.namePrefix}-public-${index + 1}` }],
      });
    });

    const privateSubnets = props.privateSubnetCidrs.map((cidr, index) => {
      return new ec2.CfnSubnet(this, `PrivateSubnet${index + 1}`, {
        vpcId: vpc.ref,
        cidrBlock: cidr,
        availabilityZone: Fn.select(index, azs),
        mapPublicIpOnLaunch: false,
        tags: [{ key: "Name", value: `${props.namePrefix}-private-${index + 1}` }],
      });
    });

    const eip = new ec2.CfnEIP(this, "NatEip", {
      domain: "vpc",
      tags: [{ key: "Name", value: `${props.namePrefix}-nat-eip` }],
    });

    const nat = new ec2.CfnNatGateway(this, "NatGateway", {
      allocationId: eip.attrAllocationId,
      subnetId: publicSubnets[0].ref,
      tags: [{ key: "Name", value: `${props.namePrefix}-nat` }],
    });

    const publicRt = new ec2.CfnRouteTable(this, "PublicRouteTable", {
      vpcId: vpc.ref,
      tags: [{ key: "Name", value: `${props.namePrefix}-public-rt` }],
    });
    new ec2.CfnRoute(this, "PublicDefaultRoute", {
      routeTableId: publicRt.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: igw.ref,
    });
    publicSubnets.forEach((subnet, index) => {
      new ec2.CfnSubnetRouteTableAssociation(this, `PublicRta${index + 1}`, {
        subnetId: subnet.ref,
        routeTableId: publicRt.ref,
      });
    });

    const privateRt = new ec2.CfnRouteTable(this, "PrivateRouteTable", {
      vpcId: vpc.ref,
      tags: [{ key: "Name", value: `${props.namePrefix}-private-rt` }],
    });
    new ec2.CfnRoute(this, "PrivateDefaultRoute", {
      routeTableId: privateRt.ref,
      destinationCidrBlock: "0.0.0.0/0",
      natGatewayId: nat.ref,
    });
    privateSubnets.forEach((subnet, index) => {
      new ec2.CfnSubnetRouteTableAssociation(this, `PrivateRta${index + 1}`, {
        subnetId: subnet.ref,
        routeTableId: privateRt.ref,
      });
    });

    for (const [key, value] of Object.entries(props.tags)) {
      Tags.of(this).add(key, value);
    }

    this.vpcId = vpc.ref;
    this.publicSubnetIds = publicSubnets.map((subnet) => subnet.ref);
    this.privateSubnetIds = privateSubnets.map((subnet) => subnet.ref);

    new CfnOutput(this, "VpcId", { value: this.vpcId });
    new CfnOutput(this, "PublicSubnetIds", {
      value: this.publicSubnetIds.join(","),
    });
    new CfnOutput(this, "PrivateSubnetIds", {
      value: this.privateSubnetIds.join(","),
    });
  }
}
