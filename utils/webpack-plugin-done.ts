// import { browser } from './browser';
import * as webpack from 'webpack';

export class SkyWebpackPluginDone {
  public apply(compiler: webpack.Compiler): void {
    compiler.hooks.done.tap('SkyWebpackPluginDone', () => {
      console.log('Hello, World!');
    });
  }
  // let launched = false;
  // this.plugin('done', () => {
  //   if (!launched) {
  //     launched = true;
  //     console.log('HELLO, NURSE!');
  //     // const argv = {};
  //     // const skyPagesConfig = {
  //     //   skyux: {
  //     //     host: {
  //     //       url: 'https://host.nxt.blackbaud.com'
  //     //     }
  //     //   }
  //     // };
  //     // browser(argv, skyPagesConfig, stats, 4242);
  //   }
  // });
}