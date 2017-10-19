/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { APIService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResourceService,
        APIService,
        AuthenticationService,
        CacheService,
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

  it('should get content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';

    const response = {
      "@id": "http://fake/Plone/",
      "@type": "Plone Site",
      "id": "Plone",
      "items": [
        {
          "@id": "http://fake/Plone/front-page",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "title": "Welcome to Plone"
        },
        {
          "@id": "http://fake/Plone/news",
          "@type": "Folder",
          "description": "Site News",
          "title": "News"
        },
        {
          "@id": "http://fake/Plone/events",
          "@type": "Folder",
          "description": "Site Events",
          "title": "Events"
        },
        {
          "@id": "http://fake/Plone/Members",
          "@type": "Folder",
          "description": "Site Users",
          "title": "Users"
        }
      ],
      "items_total": 5,
      "parent": {}
    };

    service.get('/').subscribe(content => {
      id = content['@id'];
    });

    http.expectOne('http://fake/Plone/').flush(response);

    expect(id).toBe('http://fake/Plone/');
  });

  it('should search contents', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      "@id": "http://fake/Plone/@search",
      "items": [
        {
          "@id": "http://fake/Plone/folder1/page1",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "review_state": "private",
          "title": "Welcome to Plone"
        }
      ],
      "items_total": 1
    };

    service.find({ SearchableText: 'John', path: { query: '/folder1', depth: 2 } }).subscribe(content => {
      id = content.items[0]['@id'];
    });

    http.expectOne('http://fake/Plone/@search?SearchableText=John&path.query=%2Ffolder1&path.depth=2').flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should search contents in context', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      "@id": "http://fake/Plone/folder1/@search",
      "items": [
        {
          "@id": "http://fake/Plone/folder1/page1",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "review_state": "private",
          "title": "Welcome to Plone"
        }
      ],
      "items_total": 1
    };

    service.find({ SearchableText: 'John' }, '/folder1').subscribe(content => {
      id = content.items[0]['@id'];
    });

    http.expectOne('http://fake/Plone/folder1/@search?SearchableText=John').flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should sort search results', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      "@id": "http://fake/Plone/@search",
      "items": [
        {
          "@id": "http://fake/Plone/folder1/page1",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "review_state": "private",
          "title": "Welcome to Plone"
        }
      ],
      "items_total": 1
    };
    service.find({ SearchableText: 'John' }, '', { sort_on: 'created' }).subscribe(content => {
      id = content.items[0]['@id'];
    });

    http.expectOne('http://fake/Plone/@search?SearchableText=John&sort_on=created').flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should add metadata to search results', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      "@id": "http://fake/Plone/@search",
      "items": [
        {
          "@id": "http://fake/Plone/folder1/page1",
          "@type": "Document",
          "description": "Congratulations! You have successfully installed Plone.",
          "review_state": "private",
          "title": "Welcome to Plone"
        }
      ],
      "items_total": 1
    };
    service.find({ SearchableText: 'John' }, '', { metadata_fields: ['Creator', 'CreationDate'] }).subscribe(content => {
      id = content.items[0]['@id'];
    });

    http.expectOne('http://fake/Plone/@search?SearchableText=John&metadata_fields:list=Creator&metadata_fields:list=CreationDate').flush(response);

    id = 'http://fake/Plone/folder1/page1';
  });

  it('should create new content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@type': 'Document',
      'id': 'my-document',
      'title': 'My Document',
    };

    service.create('/folder1', {
      '@type': 'Document',
      'id': 'my-document',
      'title': 'My Document',
    }).subscribe(content => {
      id = content.id;
    });

    http.expectOne('http://fake/Plone/folder1').flush(response);

    expect(id).toBe('my-document');
  });

  it('should delete content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    const response = 'passed';

    service.delete('/page1').subscribe(content => {
      received_content = content;
    });

    http.expectOne('http://fake/Plone/page1').flush(response);

    expect(received_content).toBe('passed');
  });

  it('should copy content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    let response = [
      {
        "new": "http://fake/Plone/copy_of_front-page",
        "old": "http://fake/Plone/front-page"
      }
    ];

    service.copy('/front-page', '/copy_of_front-page').subscribe(content => {
      received_content = content[0].new;
    });

    http.expectOne('http://fake/Plone/copy_of_front-page/@copy').flush(response);

    expect(received_content).toBe('http://fake/Plone/copy_of_front-page');
  });

  it('should move content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    let response = [
      {
        "new": "http://fake/Plone/copy_of_front-page",
        "old": "http://fake/Plone/front-page"
      }
    ];

    service.move('/front-page', '/copy_of_front-page').subscribe(content => {
      received_content = content[0].new;
    });

    http.expectOne('http://fake/Plone/copy_of_front-page/@move').flush(response);

    expect(received_content).toBe('http://fake/Plone/copy_of_front-page');
  });

  it('should change workflow state', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let state = 'invalid';
    let response = {
      "action": "publish",
      "actor": "admin",
      "comments": "",
      "review_state": "published",
      "time": "2016-10-21T19:05:00+00:00"
    };

    service.transition('/somepage', 'publish').subscribe(content => {
      state = content.review_state;
    });

    http.expectOne('http://fake/Plone/somepage/@workflow/publish').flush(response);

    expect(state).toBe('published');
    // TODO:  check verb and status code
  });

  it('should update content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    const response = 'passed';

    service.update('/somepage', { 'title': 'New title' }).subscribe(content => {
      received_content = content;
    });

    http.expectOne('http://fake/Plone/somepage').flush(response);

    expect(received_content).toBe('passed');
    // TODO:  check verb status code
  });

  it('should get global nav', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let url = 'invalid';
    const response = [
      {
        "@id": "http://fake/Plone/front-page/@components/navigation",
        "items": [
          {
            "title": "Home",
            "url": "http://fake/Plone"
          },
          {
            "title": "Welcome to Plone",
            "url": "http://fake/Plone/front-page"
          }
        ]
      }
    ];

    service.navigation().subscribe(items => {
      url = items[0].url;
    });

    http.expectOne('http://fake/Plone/@components/navigation').flush(response);

    expect(url).toBe('http://fake/Plone');
  });

  it('should get breadcrumbs', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let title = 'invalid';
    let response = [
      {
        "@id": "http://fake/Plone/a-folder/test/@components/breadcrumbs",
        "items": [
          {
            "title": "A folder",
            "url": "http://fake/Plone/a-folder"
          },
          {
            "title": "test",
            "url": "http://fake/Plone/a-folder/test"
          }
        ]
      }
    ];

    service.breadcrumbs('/a-folder/test').subscribe(items => {
      title = items[0].title;
    });

    http.expectOne('http://fake/Plone/a-folder/test/@components/breadcrumbs').flush(response);

    expect(title).toBe('A folder');
  });
});
