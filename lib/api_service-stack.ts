import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';

export class ApiServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = 'apigateway.cdk.clarence.tw'
    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.clarence.tw'
    });
    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: "*.cdk.clarence.tw",
      validation: acm.CertificateValidation.fromDns(zone),
    });
    const api = new apigw.RestApi(this, "Endpoint", {
      domainName: {
        domainName,
        certificate,
      },
    });
    new route53.ARecord(this, 'DomainARecord', {
      recordName: domainName,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
    });
    
    new cdk.CfnOutput(this, 'DomainName', {
      value: `https://${domainName}`
    })

    const main = new lambda.Function(this, "lambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("resources")
    });
    const getIntegration = new apigw.LambdaIntegration(main);
    api.root.addMethod("GET", getIntegration);

    const helloHandler = new lambda.Function(this, "helloLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("resources")
    });
    const getHelloIntegration = new apigw.LambdaIntegration(helloHandler);
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', getHelloIntegration);

    const aws = api.root.addResource('example');
    aws.addMethod('GET', new apigw.HttpIntegration('https://example.com/'));
  }
}
