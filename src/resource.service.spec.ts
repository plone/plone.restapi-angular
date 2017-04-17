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

import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourceService,
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

  it('should get content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.get('/').map(res => res.json()).subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
    });
  }));

  it('should search contents', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?SearchableText=John&path.query=%2Ffolder1&path.depth=2');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.find({SearchableText: 'John', path: {query: '/folder1', depth: 2}}).map(res => res.json()).subscribe(content => {
      expect(content.items[0]['@id']).toBe('http://fake/Plone/folder1/page1');
    });
  }));

  it('should search contents in context', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/folder1/@search?SearchableText=John');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.find({ SearchableText: 'John' }, '/folder1').map(res => res.json()).subscribe(content => {
      expect(content.items[0]['@id']).toBe('http://fake/Plone/folder1/page1');
    });
  }));
  
  it('should sort search results', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?SearchableText=John&sort_on=created');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.find({ SearchableText: 'John' }, '', 'created').map(res => res.json()).subscribe(content => {
      expect(content.items[0]['@id']).toBe('http://fake/Plone/folder1/page1');
    });
  }));

  it('should add metadata to search results', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?SearchableText=John&metadata_fields:list=Creator&metadata_fields:list=CreationDate');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.find({ SearchableText: 'John' }, '', null, ['Creator', 'CreationDate']).map(res => res.json()).subscribe(content => {
      expect(content.items[0]['@id']).toBe('http://fake/Plone/folder1/page1');
    });
  }));
  
  it('should create new content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/folder1');
      let response = {
        '@type': 'Document',
        'id': 'my-document',
        'title': 'My Document',
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.create('/folder1', {
        '@type': 'Document',
        'id': 'my-document',
        'title': 'My Document',
      }).map(res => res.json()).subscribe(content => {
      expect(content.id).toBe('my-document');
    });
  }));

  it('should delete content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/page1');
      c.mockRespond(new Response(new ResponseOptions()));
    });
    service.delete('/page1').map(res => res.json()).subscribe(content => {
      expect(content).toBe(null);     
    });
  }));

  it('should copy content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/copy_of_front-page/@copy');
      let response = [
        {
          "new": "http://fake/Plone/copy_of_front-page",
          "old": "http://fake/Plone/front-page"
        }
      ];
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.copy('/front-page', '/copy_of_front-page').map(res => res.json()).subscribe(content => {
      expect(content[0].new).toBe('http://fake/Plone/copy_of_front-page');
    });
  }));

  it('should move content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/copy_of_front-page/@move');
      let response = [
        {
          "new": "http://fake/Plone/copy_of_front-page",
          "old": "http://fake/Plone/front-page"
        }
      ];
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.move('/front-page', '/copy_of_front-page').map(res => res.json()).subscribe(content => {
      expect(content[0].new).toBe('http://fake/Plone/copy_of_front-page');
    });
  }));

  it('should change workflow state', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/somepage/@workflow/publish');
      let response = {
        "action": "publish",
        "actor": "admin",
        "comments": "",
        "review_state": "published",
        "time": "2016-10-21T19:05:00+00:00"
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.transition('/somepage', 'publish').map(res => res.json()).subscribe(content => {
      expect(content.review_state).toBe('published');
    });
  }));

  it('should update content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/somepage');
      c.mockRespond(new Response(new ResponseOptions()));
    });
    service.update('/somepage', { 'title': 'New title' }).map(res => res.json()).subscribe(content => {
      expect(content).toBe(null);
    });
  }));

  it('should get global nav', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@components/navigation');
      let response = [
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
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.navigation().map(res => res.json()).subscribe(content => {
      expect(content[0].items[0].url).toBe('http://fake/Plone');
    });
  }));
});
