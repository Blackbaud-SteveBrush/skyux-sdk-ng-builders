import {
  JsonObject,
  JsonValue
} from '@angular-devkit/core';

export interface SkyBuilderOptions extends JsonObject {
  skyux: {
    app: {
      externals: {
        css: {
          before: {
            url: string;
            integrity: string;
          }[];
          after: {
            url: string;
            integrity: string;
          }[];
        },
        js: {
          before: {
            url: string;
            integrity: string;
            head: boolean;
          }[];
          after: {
            url: string;
            integrity: string;
            head: boolean;
          }[];
        }
      };
    },
    host: {
      url: string;
    };
    name: string;
    params: {
      [key: string]: JsonValue & {
        excludeFromRequests: boolean;
        required: boolean;
        value: any;
      }
    };
  }
}
