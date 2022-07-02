#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkShowExportedAwsResourcesStack } from '../lib/cdk-show-exported-aws-resources-stack';

const app = new cdk.App();
new CdkShowExportedAwsResourcesStack(app, 'CdkShowExportedAwsResourcesStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});