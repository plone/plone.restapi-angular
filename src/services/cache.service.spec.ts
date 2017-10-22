/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { APIService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { CacheService } from './cache.service';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from './loading.service';

const front_page_response = {
      "@id": "http://fake/Plone/",
      "@type": "Plone Site",
      "id": "Plone",
      "items": [
        {
          "@id": "http://fake/Plone/front-page",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "title": "Welcome to Plone"
        }
      ],
      "items_total": 1,
      "parent": {}
    };

const events_page_response = {
      "@id": "http://fake/Plone/events",
      "@type": "Folder",
      "id": "Plone",
      "items": [
        {
          "@id": "http://fake/Plone/events/event1",
          "@type": "Document",
          "description": "",
          "title": "Event 1"
        }
      ],
      "items_total": 1,
      "parent": {}
    };

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        LoadingService,
        {
          provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://fake/Plone',
          CACHE_REFRESH_DELAY: 1000,
        }
        },
        CacheService,
      ]
    });
  });

  afterEach(() => {
    TestBed.get(CacheService).revoke.emit();
  });

  it('should cache and then get cached content', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    let response = front_page_response;

    expect(cache.cache['http://fake/Plone/']).toBeUndefined();

    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);
    expect(cache.cache['http://fake/Plone/']).toBeDefined();
    expect(cache.hits['http://fake/Plone/']).toBe(1);

    // we actually get content but request has not been sent again
    cache.get('http://fake/Plone/').subscribe((content) => {
      expect(content).toBe(front_page_response);
    });
    http.expectNone('http://fake/Plone/');
    expect(cache.hits['http://fake/Plone/']).toBe(2);
  });

  it('should clear cache at revoke', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    let response = front_page_response;
    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);
    cache.revoke.emit();
    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);
    expect(cache.hits['http://fake/Plone/']).toBe(1);
    expect(cache.cache['http://fake/Plone/']).toBeDefined();
  });

  it('should clear cache by key when revoke for key', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    const response1 = front_page_response;
    const response2 = events_page_response;
    Observable.forkJoin(
      cache.get('http://fake/Plone/'),
      cache.get('http://fake/Plone/events')
    ).subscribe(() => {});

    http.expectOne('http://fake/Plone/').flush(response1);
    http.expectOne('http://fake/Plone/events').flush(response2);
    expect(cache.hits['http://fake/Plone/']).toBe(1);
    expect(cache.hits['http://fake/Plone/events']).toBe(1);

    cache.revoke.emit('http://fake/Plone/events');
    expect(cache.hits['http://fake/Plone/']).toBe(1);
    expect(cache.cache['http://fake/Plone/']).toBeDefined();
    expect(cache.hits['http://fake/Plone/events']).toBeUndefined();
    expect(cache.cache['http://fake/Plone/events']).toBeUndefined();
  });

  it('should revoke the cache when user log in', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    const auth = TestBed.get(AuthenticationService);
    let response = front_page_response;
    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);
    auth.isAuthenticated.next({ state: true });
    expect(cache.cache['http://fake/Plone/']).toBeUndefined();
  });
});

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        LoadingService,
        {
          provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://fake/Plone',
          CACHE_REFRESH_DELAY: 5
        }
        },
        CacheService,
      ]
    });
  });

  // because of timer we do not revoke cache in afterEach, which is executed in same event loop

  it('should not use cache if delay is passed', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    let response = front_page_response;
    expect(cache.refreshDelay).toBe(5);
    expect(cache.cache['http://fake/Plone/']).toBeUndefined();

    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);

    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectNone('http://fake/Plone/');

    Observable.timer(5).subscribe(() => {
      cache.get('http://fake/Plone/').subscribe(() => {});
      http.expectOne('http://fake/Plone/').flush(response);
      expect(cache.hits['http://fake/Plone/']).toBe(1);
      cache.revoke.emit();
    });
  });
});

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        LoadingService,
        {
          provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://fake/Plone',
          CACHE_MAX_SIZE: 2,
        }
        },
        CacheService,
      ]
    });
  });

  afterEach(() => {
    TestBed.get(CacheService).revoke.emit();
  });

  it('should refreshed store when cache max size is reached', () => {
    const cache = TestBed.get(CacheService);
    const http = TestBed.get(HttpTestingController);
    let response = front_page_response;
    expect(cache.maxSize).toBe(2);

    cache.get('http://fake/Plone/').subscribe(() => {});
    http.expectOne('http://fake/Plone/').flush(response);
    expect(cache.cache['http://fake/Plone/']).toBeDefined();

    cache.get('http://fake/Plone/1').subscribe(() => {});
    http.expectOne('http://fake/Plone/1').flush(response);

    cache.get('http://fake/Plone/2').subscribe(() => {});
    http.expectOne('http://fake/Plone/2').flush(response);
    expect(cache.cache['http://fake/Plone/2']).toBeDefined();
    expect(cache.hits['http://fake/Plone/2']).toBe(1);
    expect(cache.cache['http://fake/Plone/']).toBeUndefined();
    expect(cache.hits['http://fake/Plone/']).toBeUndefined();
  });
});
