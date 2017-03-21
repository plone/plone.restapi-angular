import { Inject, Injectable } from '@angular/core';

export var CONFIGURATION: any = {};

@Injectable()
export class ConfigurationService {

  constructor(
    @Inject(CONFIGURATION) private config: any,
  ) {}

  get(key: string) {
    return this.config[key];
  }

  urlToPath(url: string): string {
    let base: string = this.get('BACKEND_URL');
    return url.split(base)[1] || '/'
  }
}