import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

  constructor(
    @Inject('CONFIGURATION') protected config: any,
  ) {}

  get(key: string, defaultValue?: any): any {
    if (defaultValue !== undefined && !(this.config.hasOwnProperty(key))) {
      return defaultValue;
    } else {
      return this.config[key];
    }
  }

  urlToPath(url: string): string {
    const base: string = this.get('BACKEND_URL');
    return url.split(base)[1] || '/';
  }
}
