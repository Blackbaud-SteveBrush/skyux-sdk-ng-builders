import { BuilderContext, createBuilder, targetFromTargetString } from '@angular-devkit/architect';

import { executeDevServerBuilder, DevServerBuilderOutput, DevServerBuilderOptions } from '@angular-devkit/build-angular';

import { getSystemPath, normalize } from '@angular-devkit/core';

import { Observable, from } from 'rxjs';

import { switchMap } from 'rxjs/operators';

import { SkyBuilderOptions } from '../builder-options';

import { getTransforms } from '../common';

export function devServerBuilder(
  options: DevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  async function setup() {
    const browserTarget = targetFromTargetString(options.browserTarget);
    return (context.getTargetOptions(browserTarget) as unknown) as SkyBuilderOptions;
  }

  return from(setup()).pipe(
    switchMap(targetOptions => {
      context.logger.info(`Running from workspace root: ${getSystemPath(normalize(context.workspaceRoot))}`);

      const baseHref = `/${targetOptions.skyux.name}/`;

      options.host = 'localhost';
      options.publicHost = 'localhost';
      options.baseHref = baseHref;
      options.ssl = true;
      options.sslCert = '/Users/stevebr/.skyux/certs/skyux-server.crt';
      options.sslKey = '/Users/stevebr/.skyux/certs/skyux-server.key';

      targetOptions.baseHref = baseHref;
      targetOptions.port = 8080;

      targetOptions.skyux.host = targetOptions.skyux.host || {};
      targetOptions.skyux.host.url = 'https://host.nxt.blackbaud.com/';

      console.log('Options in dev-server:', options, targetOptions);

      return executeDevServerBuilder(options, context, getTransforms(targetOptions, context));
    })
  );
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(devServerBuilder);
