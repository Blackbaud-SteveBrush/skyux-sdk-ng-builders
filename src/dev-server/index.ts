import { BuilderContext, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import { ExecutionTransformer, executeDevServerBuilder, DevServerBuilderOutput, DevServerBuilderOptions } from '@angular-devkit/build-angular';

import { Configuration as WebpackConfiguration } from 'webpack';
import { smartStrategy } from 'webpack-merge';
import { MergeStrategy } from 'webpack-merge';

import { getSystemPath, normalize, JsonObject } from '@angular-devkit/core';
import { IndexHtmlTransform } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';

import { SkyWebpackPluginDone } from '../utils/webpack-plugin-done';
// import { SkyBrowser } from './browser';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export type SkyWebpackConfigTransformFactory = (options: SkyDevServerBuilderOptions, context: BuilderContext) => ExecutionTransformer<WebpackConfiguration>;
export type SkyIndexHtmlTransformFactory = (options: SkyDevServerBuilderOptions, context: BuilderContext) => IndexHtmlTransform;

export type SkyMergeStrategies = { [field: string]: MergeStrategy };

export interface SkyDevServerBuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<WebpackConfiguration>;
  logging?: WebpackLoggingCallback;
  indexHtml?: IndexHtmlTransform | undefined;
}

export interface SkyCustomWebpackBuilderConfig {
  path?: string;
  mergeStrategies?: SkyMergeStrategies;
  replaceDuplicatePlugins?: boolean;
}

export interface SkyDevServerBuilderOptions extends JsonObject {
}

export const webpackConfigTransformFactory: SkyWebpackConfigTransformFactory = (options: SkyDevServerBuilderOptions, context: BuilderContext) => {
  return (defaultWebpackConfig) => {

    const merged = smartStrategy({})(defaultWebpackConfig, {
      plugins: [
        new SkyWebpackPluginDone()
      ]
    });

    console.log('OPTIONS: ', options);
    console.log('Workspace root:', context.workspaceRoot);
    console.log('Merged config:', merged);

    return merged;

  };
};

export function indexHtmlTransformFactory(options: SkyDevServerBuilderOptions, context: BuilderContext): IndexHtmlTransform | undefined {
  if (!options.indexTransform) {
    return;
  }

  const transform = require(`${getSystemPath(normalize(context.workspaceRoot))}/${options.indexTransform}`);
  return async (indexHtml: string) => transform(context.target, indexHtml);
}

export function getTransforms(options: SkyDevServerBuilderOptions, context: BuilderContext): SkyDevServerBuilderTransforms {
  return {
    webpackConfiguration: webpackConfigTransformFactory(options, context),
    indexHtml: indexHtmlTransformFactory(options, context)
  };
}

export function devServerBuilder(
  options: DevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  async function setup(): Promise<JsonObject> {
    const browserTarget = targetFromTargetString(options.browserTarget);
    return (context.getTargetOptions(browserTarget) as unknown) as JsonObject;
  }

  return from(setup()).pipe(
    switchMap(targetOptions => {
      context.logger.info(`Running from workspace root: ${getSystemPath(normalize(context.workspaceRoot))}`);

      options.host = 'localhost';
      options.publicHost = 'localhost';
      options.baseHref = '/skyux-spa/';
      options.port = 8080;
      options.open = false;
      options.ssl = true;
      options.sslCert = '/Users/stevebr/.skyux/certs/skyux-server.crt';
      options.sslKey = '/Users/stevebr/.skyux/certs/skyux-server.key';

      return executeDevServerBuilder(options, context, getTransforms(targetOptions, context));
    })
  );
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(devServerBuilder);
