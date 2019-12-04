import { BuilderContext, createBuilder } from '@angular-devkit/architect';

import { executeBrowserBuilder, BrowserBuilderOutput, BrowserBuilderOptions } from '@angular-devkit/build-angular';

import { JsonObject } from '@angular-devkit/core';

import { Observable } from 'rxjs';

import { SkyBuilderOptions } from '../builder-options';

import { getTransforms } from '../common';

export type SkyBrowserBuilderOptions = BrowserBuilderOptions & SkyBuilderOptions;

export function browserBuilder(
  options: SkyBrowserBuilderOptions,
  context: BuilderContext
): Observable<BrowserBuilderOutput> {

  options.skyux = options.skyux || {};
  options.skyux.host = options.skyux.host || {};
  options.skyux.host.url = 'https://host.nxt.blackbaud.com/';

  console.log('Options in browser builder:', options);

  return executeBrowserBuilder(options, context, getTransforms(options, context));
}

export default createBuilder<JsonObject & SkyBrowserBuilderOptions>(browserBuilder);
