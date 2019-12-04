import {
  SkyBuilderOptions
} from '../builder-options';

const sorter = require('html-webpack-plugin/lib/chunksorter');

function getScripts(chunks: any): any[] {
  const scripts: any[] = [];

  // Used when skipping the build, short-circuit to return metadata
  if (chunks.metadata) {
    return chunks.metadata;
  }

  sorter.dependency(chunks, undefined, {}).forEach((chunk: any) => {
    scripts.push({
      name: chunk.files[0]
    });
  });

  // Webpack reversed the order of these scripts
  scripts.reverse();

  return scripts;
}

export const hostUtils = {
  resolve: (url: string, localUrl: string, chunks: any, options: SkyBuilderOptions): string => {

    let host = options.skyux.host.url;
    let config: any = {
      scripts: getScripts(chunks),
      localUrl
    };

    if (options.skyux.app && options.skyux.app.externals) {
      config.externals = options.skyux.app.externals;
    }

    // Trim leading slash since getAppBase adds it
    if (url && url.charAt(0) === '/') {
      url = url.substring(1);
    }

    // Trim trailing slash since geAppBase adds it
    if (host && host.charAt(host.length - 1) === '/') {
      host = host.slice(0, -1);
    }

    const delimeter = url.indexOf('?') === -1 ? '?' : '&';
    const encoded = Buffer.from(JSON.stringify(config)).toString('base64');
    const base = options.baseHref;
    const resolved = `${host}${base}${url}${delimeter}local=true&_cfg=${encoded}`;

    return resolved;
  }
};