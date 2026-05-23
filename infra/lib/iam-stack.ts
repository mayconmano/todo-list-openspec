import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const user = new iam.User(this, 'CicdUser', {
      userName: 'todo-list-cicd',
    });

    user.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'lambda:*',
          'apigateway:*',
          'cloudformation:*',
          's3:*',
          'cloudfront:*',
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:GetRole',
          'iam:PassRole',
          'iam:PutRolePolicy',
          'iam:DeleteRolePolicy',
          'iam:GetRolePolicy',
          'logs:*',
        ],
        resources: ['*'],
      }),
    );

    const accessKey = new iam.CfnAccessKey(this, 'CicdAccessKey', {
      userName: user.userName,
    });

    new cdk.CfnOutput(this, 'AccessKeyId', {
      value: accessKey.ref,
      description: 'IAM Access Key ID for GitHub Actions',
    });

    new cdk.CfnOutput(this, 'SecretAccessKey', {
      value: accessKey.attrSecretAccessKey,
      description: 'IAM Secret Access Key for GitHub Actions',
    });
  }
}
