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
}