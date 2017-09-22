import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

  constructor(
    @Inject('CONFIGURATION') private config: any,
  ) {}

  get(key: string): any {
    return this.config[key];
  }

  urlToPath(url: string): string {
    let base: string = this.get('BACKEND_URL');
    return url.split(base)[1] || '/';
  }
}
