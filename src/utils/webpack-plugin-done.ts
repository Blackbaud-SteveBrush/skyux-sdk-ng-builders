import { SkyBrowser } from './browser';
import * as webpack from 'webpack';
import { SkyBuilderOptions } from '../builder-options';
import * as open from 'open';

export class SkyWebpackPluginDone {

  constructor(
    private options: SkyBuilderOptions
  ) { }

  public apply(compiler: webpack.Compiler): void {
    let launched = false;

    compiler.hooks.done.tap('SkyWebpackPluginDone', (stats) => {
      if (launched) {
        return;
      }

      console.log('Options in plugin:', this.options);

      const url = SkyBrowser.getLaunchUrl(this.options, stats);

      console.info(`Launching host URL: ${url}`);

      // Launch the URL.
      open(url, {
        app: 'google chrome',
        url: true
      });

      launched = true;
    });
  }
}