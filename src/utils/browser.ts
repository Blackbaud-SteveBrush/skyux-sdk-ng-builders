const util = require('util');

import {
  SkyBuilderOptions
} from '../builder-options';

import {
  hostUtils
} from './host-utils';

// function getQueryStringFromArgv(argv: any, options: SkyBuilderOptions) {

//   const configParams = options.skyux.params;

//   let params;

//   if (Array.isArray(configParams)) {
//     params = configParams;
//   } else {
//     // Get the params that have truthy values, since false/undefined indicates
//     // the parameter should not be added.
//     params = Object.keys(configParams).filter(configParam => configParams[configParam]);
//   }

//   const found: any[] = [];
//   params.forEach(param => {
//     if (argv[param]) {
//       found.push(`${param}=${encodeURIComponent(argv[param])}`);
//     }
//   });

//   if (found.length) {
//     return `?${found.join('&')}`;
//   }

//   return '';
// }

export class SkyBrowser {

  public static getLaunchUrl(options: SkyBuilderOptions, stats: any): string {
    // const queryStringBase = getQueryStringFromArgv(argv, options);

    const queryStringBase = '';

    console.log('Browser config:', options.port, options.baseHref);

    const localUrl = util.format(
      'https://localhost:%s%s',
      options.port,
      options.baseHref
    );

    console.log('Local url:', localUrl);

    const hostUrl = hostUtils.resolve(
      queryStringBase,
      localUrl,
      stats.toJson().chunks,
      options
    );

    return hostUrl;
  }

}
