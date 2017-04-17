/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
      ]
    });
  });

  it('should return stored values', inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service.get('BACKEND_URL')).toBe('http://fake/Plone');
  }));
});
