import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class ApiServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const main = new lambda.Function(this, "lambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("resources")
    });

    const api = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: main,
      proxy: false
    })

    const root = api.root;
    root.addMethod('GET')

    const hello = api.root.addResource('hello');
    hello.addMethod('GET'); 
  }
}
