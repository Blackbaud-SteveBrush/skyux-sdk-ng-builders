/*jslint node: true */
'use strict';

const util = require('util');

import {
  hostUtils
} from './host-utils';

function getQueryStringFromArgv(argv: any, skyPagesConfig: any) {

  const configParams = skyPagesConfig.skyux.params;

  let params;

  if (Array.isArray(configParams)) {
    params = configParams;
  } else {
    // Get the params that have truthy values, since false/undefined indicates
    // the parameter should not be added.
    params = Object.keys(configParams).filter(configParam => configParams[configParam]);
  }

  const found: any[] = [];
  params.forEach(param => {
    if (argv[param]) {
      found.push(`${param}=${encodeURIComponent(argv[param])}`);
    }
  });

  if (found.length) {
    return `?${found.join('&')}`;
  }

  return '';
}

export class SkyBrowser {
  public static getLaunchUrl(argv: any, skyPagesConfig: any, stats: any, port: number): string {
    const queryStringBase = getQueryStringFromArgv(argv, skyPagesConfig);

    let localUrl = util.format(
      'https://localhost:%s%s',
      port,
      '/skyux-spa/' // TODO: pull this from config!
    );

    let hostUrl = hostUtils.resolve(
      queryStringBase,
      localUrl,
      stats.toJson().chunks,
      skyPagesConfig
    );

    // Edge uses a different technique (protocol vs executable)
    if (argv.browser === 'edge') {
      const edge = 'microsoft-edge:';
      argv.browser = undefined;
      hostUrl = edge + hostUrl;
      localUrl = edge + localUrl;
    }

    // Browser defaults to launching host
    argv.launch = argv.launch || 'host';

    if (argv.launch === 'local') {
      // Only adding queryStringBase to the message + local url opened,
      // Meaning doesn't need those to communicate back to localhost
      localUrl += queryStringBase;
      console.info(`Launching Local URL: ${localUrl}`);
      return localUrl;
    }

    console.info(`Launching Host URL: ${hostUrl}`);
    return hostUrl;
  }
}
