import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class ApiServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, "Endpoint");

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
