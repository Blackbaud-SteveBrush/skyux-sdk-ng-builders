import { SkyBrowser } from './browser';
import * as webpack from 'webpack';
const open = require('open');

export class SkyWebpackPluginDone {
  public apply(compiler: webpack.Compiler): void {
    compiler.hooks.done.tap('SkyWebpackPluginDone', (stats) => {

      const argv = {
        _: [ 'serve' ],
        sslCert: '/Users/stevebr/.skyux/certs/skyux-server.crt',
        sslKey: '/Users/stevebr/.skyux/certs/skyux-server.key'
      };

      const skyPagesConfig = {
        runtime: {
          app: {
            inject: false,
            template: '/Users/stevebr/Projects/github/blackbaud/skyux-sdk-template/node_modules/@skyux-sdk/builder/src/main.ejs',
            base: '/skyux-spa/',
            name: 'skyux-spa'
          },
          command: 'serve',
          componentsPattern: '**/*.component.ts',
          componentsIgnorePattern: './public/**/*',
          includeRouteModule: true,
          routesPattern: '**/index.html',
          runtimeAlias: 'sky-pages-internal/runtime',
          srcPath: 'src/app/',
          spaPathAlias: 'sky-pages-spa',
          skyPagesOutAlias: 'sky-pages-internal',
          useTemplateUrl: false,
          handle404: true,
          routes: []
        },
        skyux: {
          '$schema': './node_modules/@skyux/config/skyuxconfig-schema.json',
          mode: 'easy',
          host: {
            url: 'https://host.nxt.blackbaud.com'
          },
          app: {
            title: 'Blackbaud - SKY UX Application'
          },
          compileMode: 'aot',
          params: {
            addin: true,
            envid: true,
            leid: true,
            svcid: true
          },
          help: {
            extends: 'bbhelp'
          }
        }
      };

      const url = SkyBrowser.getLaunchUrl(argv, skyPagesConfig, stats, 8080);

      open(url, {
        app: 'chrome',
        url: true
      });
    });
  }
}