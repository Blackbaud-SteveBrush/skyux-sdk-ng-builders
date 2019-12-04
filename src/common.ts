import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  IndexHtmlTransform
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';

import {
  getSystemPath,
  normalize
} from '@angular-devkit/core';

import {
  Configuration as WebpackConfiguration
} from 'webpack';

import {
  smartStrategy
} from 'webpack-merge';

import {
  SkyBuilderOptions
} from './builder-options';

import {
  SkyBuilderTransforms
} from './builder-transforms';

import {
  SkyWebpackPluginDone
} from './utils/webpack-plugin-done';

type SkyWebpackConfigTransformFactory = (options: SkyBuilderOptions, context: BuilderContext) => ExecutionTransformer<WebpackConfiguration>;

export const webpackConfigTransformFactory: SkyWebpackConfigTransformFactory = (options: SkyBuilderOptions, context: BuilderContext) => {
  return (defaultWebpackConfig) => {
    let customConfig: WebpackConfiguration = {};
    if (context.target && context.target.target === 'serve') {
      customConfig = {
        plugins: [
          new SkyWebpackPluginDone(options)
        ]
      };
    }

    const merged = smartStrategy({})(defaultWebpackConfig, customConfig);
    return merged;
  };
};

export function indexHtmlTransformFactory(options: SkyBuilderOptions, context: BuilderContext): IndexHtmlTransform | undefined {
  if (!options.indexTransform) {
    return;
  }

  const transform = require(`${getSystemPath(normalize(context.workspaceRoot))}/${options.indexTransform}`);
  return async (indexHtml: string) => transform(context.target, indexHtml);
}

export function getTransforms(options: SkyBuilderOptions, context: BuilderContext): SkyBuilderTransforms {
  return {
    webpackConfiguration: webpackConfigTransformFactory(options, context),
    indexHtml: indexHtmlTransformFactory(options, context)
  };
}
