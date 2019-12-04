import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  IndexHtmlTransform
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';

import {
  WebpackLoggingCallback
} from '@angular-devkit/build-webpack';

import {
  Configuration as WebpackConfiguration
} from 'webpack';

export interface SkyBuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<WebpackConfiguration>;
  logging?: WebpackLoggingCallback;
  indexHtml?: IndexHtmlTransform | undefined;
}
