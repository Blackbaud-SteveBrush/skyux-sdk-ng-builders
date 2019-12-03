import { BuilderContext, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import { ExecutionTransformer } from '@angular-devkit/build-angular';
import {
  executeDevServerBuilder, DevServerBuilderOutput, DevServerBuilderOptions
} from '@angular-devkit/build-angular';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Configuration } from 'webpack';
import { smartStrategy } from 'webpack-merge';
import { browser } from '../utils/browser';

function WebpackPluginDone(): void {
  let launched = false;
  this.plugin('done', (stats: any) => {
    if (!launched) {
      launched = true;
      const argv = {};
      const skyPagesConfig = {
        skyux: {
          host: {
            url: 'https://host.nxt.blackbaud.com'
          }
        }
      };
      browser(argv, skyPagesConfig, stats, 4242);
    }
  });
}

// export const customWebpackConfigTransformFactory: (options: any, context: BuilderContext) => ExecutionTransformer<any> = (options: any, context: BuilderContext) => (browserWebpackConfig) => {
//   console.log('EH?', options, context.workspaceRoot, browserWebpackConfig);
//   return {};
// };

// function customWebpackConfigTransformFactory(options: any, context: BuilderContext): (options: any, context: BuilderContext) => ExecutionTransformer<any> {
//   return (browserWebpackConfig) => {
//     return {};
//   }
// }

type TransformFactory = (options: any, context: BuilderContext) => ExecutionTransformer<Configuration>;

export const customWebpackConfigTransformFactory: TransformFactory = (options: any, context: BuilderContext) => {
  return (browserWebpackConfig) => {

    console.log('EH?', options, context.workspaceRoot, browserWebpackConfig);

    return smartStrategy({})(browserWebpackConfig, {
      plugins: [
        WebpackPluginDone
      ]
    });

  };
};

export function devServerBuilder(
  options: DevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  async function setup() {
    const browserTarget = targetFromTargetString(options.browserTarget);
    return (context.getTargetOptions(browserTarget) as unknown) as any;
  }

  return from(setup()).pipe(
    switchMap(customWebpackOptions => {
      console.log('webpack options:', customWebpackOptions);
      const webpackConfiguration = customWebpackConfigTransformFactory(options, context);

      return executeDevServerBuilder(options, context, {
        webpackConfiguration
      });
    })
  );

  // context.logger.info('Running from workspace root: ' + getSystemPath(normalize(context.workspaceRoot)));

  // return new Promise<BuilderOutput>(resolve => {
  //   context.logger.info(options.message);
  //   resolve({ success: true });
  // });
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(devServerBuilder);
