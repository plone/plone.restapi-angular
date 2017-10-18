/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { CommentsService } from './comments.service';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';

describe('CommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        APIService,
        AuthenticationService,
        CacheService,
        CommentsService,
        ConfigurationService,
        LoadingService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
      ]
    });
  });

  it('should return the comments', () => {
    const service = TestBed.get(CommentsService);
    const http = TestBed.get(HttpTestingController);
    let length = 0;
    let author_name = '';

    // fake response
    const response = {
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

    service.get('/a-folder/test').subscribe(res => {
      let comments = res.items;
      length = comments.length;
      author_name = comments[1].author_name;
    });

    http.expectOne('http://fake/Plone/a-folder/test/@comments').flush(response);

    expect(length).toBe(2);
    expect(author_name).toBe('Galahad of Camelot');
  });

});
