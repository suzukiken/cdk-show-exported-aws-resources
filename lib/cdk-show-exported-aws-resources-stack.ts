import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

export class CdkShowExportedAwsResourcesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const secret = new secretsmanager.Secret(this, 'Secret');
    const topic = new sns.Topic(this, 'Topic');
    const queue = new sqs.Queue(this, 'Queue');
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { 
        name: 'id', 
        type: dynamodb.AttributeType.STRING
      }
    });
    const bucket = new s3.Bucket(this, 'Bucket');
    const func = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'main.lambda_handler'
    })
    
    const succeed = new sfn.Succeed(this, "succeed");
    const statemachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: succeed
    })
    
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: { 
        origin: new origins.S3Origin(bucket)
      }
    })
    
    const role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    })
    
    const schema = new appsync.Schema({
      filePath: "graphql/schema.graphql",
    })
    
    const api = new appsync.GraphqlApi(this, "Api", {
      name: id + "-api",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        }
      },
      schema: schema
    })
    
    new CfnOutput(this, 'SecretArnOutput', { 
      value: secret.secretArn,
      exportName: this.node.tryGetContext('secret_arn_exportname'),
      description: "secretsmanager arn"
    })
    
    new CfnOutput(this, 'TopicArnOutput', { 
      value: topic.topicArn,
      exportName: this.node.tryGetContext('topic_arn_exportname'),
      description: "sns topic arn"
    })
    
    new CfnOutput(this, 'QueueUrlOutput', { 
      value: queue.queueUrl,
      exportName: this.node.tryGetContext('queue_url_exportname'),
      description: "sqs queue url"
    })
    
    new CfnOutput(this, 'QueueArnOutput', { 
      value: queue.queueArn,
      exportName: this.node.tryGetContext('queue_arn_exportname'),
      description: "sqs queue arn"
    })
    
    new CfnOutput(this, 'TableNameOutput', { 
      value: table.tableName,
      exportName: this.node.tryGetContext('table_name_exportname'),
      description: "dynamodb table name"
    })
    
    new CfnOutput(this, 'BucketNameOutput', { 
      value: bucket.bucketName,
      exportName: this.node.tryGetContext('bucket_name_exportname'),
      description: "s3 bucket name"
    })
    
    new CfnOutput(this, 'FunctionNameOutput', { 
      value: func.functionName,
      exportName: this.node.tryGetContext('function_name_exportname'),
      description: "Lambda function name"
    })
    
    new CfnOutput(this, 'StatemachineArnOutput', { 
      value: statemachine.stateMachineArn,
      exportName: this.node.tryGetContext('statemachine_arn_exportname'),
      description: "stepfunctions statemachine arn"
    })
    
    new CfnOutput(this, 'AppsyncapiIdOutput', { 
      exportName: this.node.tryGetContext('appsyncapi_id_exportname'), 
      value: api.apiId,
      description: "appsync api id"
    })
    
    new CfnOutput(this, 'AppsyncapiUrlOutput', { 
      exportName: this.node.tryGetContext('appsyncapi_url_exportname'), 
      value: api.graphqlUrl,
      description: "appsync api url"
    })
    
    new CfnOutput(this, 'RoleArnOutput', { 
      exportName: this.node.tryGetContext('role_arn_exportname'), 
      value: role.roleArn,
      description: "iam role arn"
    })
    
    new CfnOutput(this, 'DistributionIdOutput', { 
      exportName: this.node.tryGetContext('distribution_id_exportname'), 
      value: distribution.distributionId,
      description: "cloudfront distribution id"
    })
  }
}
