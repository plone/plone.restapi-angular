/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from '@angular/http';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { CommentsService } from './comments.service';
import { CacheService } from './cache.service';

describe('CommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        APIService,
        CacheService,
        AuthenticationService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
    });
  });

  it('should return the comments', inject([CommentsService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/a-folder/test/@comments');
      let response = {
        "@id": "http://fake/Plone/a-folder/test/@comments",
        "items": [
          {
            "@id": "http://fake/Plone/a-folder/test/@comments/1496662661977916",
            "@parent": null,
            "@type": "Discussion Item",
            "author_name": "Bridgekeeper",
            "author_username": "bkeeper",
            "comment_id": "1496662661977916",
            "creation_date": "2017-06-05T11:37:41",
            "in_reply_to": null,
            "modification_date": "2017-06-05T11:37:41",
            "text": {
              "data": "What... is your favourite colour?",
              "mime-type": "text/plain"
            },
            "user_notification": null
          },
          {
            "@id": "http://fake/Plone/a-folder/test/@comments/1496665801430054",
            "@parent": null,
            "@type": "Discussion Item",
            "author_name": "Galahad of Camelot",
            "author_username": "galahad",
            "comment_id": "1496665801430054",
            "creation_date": "2017-06-05T12:30:01",
            "in_reply_to": null,
            "modification_date": "2017-06-05T12:30:01",
            "text": {
              "data": "Blue. No, yel...\nauuuuuuuugh.",
              "mime-type": "text/plain"
            },
            "user_notification": null
          }
        ],
        "items_total": 2
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.get('/a-folder/test').subscribe(res => {
      let comments = res.items;
      expect(comments.length).toBe(2);
      expect(comments[1].author_name).toBe('Galahad of Camelot');
    });
  }));

});