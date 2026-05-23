#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RdsStack } from '../lib/rds-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { IamStack } from '../lib/iam-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
};

new RdsStack(app, 'RdsStack', { env });
new FrontendStack(app, 'FrontendStack', { env });
new IamStack(app, 'IamStack', { env });
