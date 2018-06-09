/* tslint:disable:no-unused-variable */
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NamedFileUpload, NavLink } from '../interfaces';
import { Vocabulary } from '../vocabularies';
import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { CacheService } from './cache.service';
import { ConfigurationService } from './configuration.service';
import { LoadingService } from './loading.service';
import { ResourceService } from './resource.service';

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
          provide: 'CONFIGURATION',
          useValue: {
            BACKEND_URL: 'http://fake/Plone'
          }
        }
      ]
    });
  });

  it('should get content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';

    const response = {
      '@id': 'http://fake/Plone/',
      '@type': 'Plone Site',
      id: 'Plone',
      items: [
        {
          '@id': 'http://fake/Plone/front-page',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          title: 'Welcome to Plone'
        },
        {
          '@id': 'http://fake/Plone/news',
          '@type': 'Folder',
          description: 'Site News',
          title: 'News'
        },
        {
          '@id': 'http://fake/Plone/events',
          '@type': 'Folder',
          description: 'Site Events',
          title: 'Events'
        },
        {
          '@id': 'http://fake/Plone/Members',
          '@type': 'Folder',
          description: 'Site Users',
          title: 'Users'
        }
      ],
      items_total: 5,
      parent: {}
    };

    service.get('/').subscribe((content: any) => {
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
      '@id': 'http://fake/Plone/@search',
      items: [
        {
          '@id': 'http://fake/Plone/folder1/page1',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'private',
          title: 'Welcome to Plone'
        }
      ],
      items_total: 1
    };

    service
      .find({ SearchableText: 'John', path: { query: '/folder1', depth: 2 } })
      .subscribe((content: any) => {
        id = content.items[0]['@id'];
      });

    http
      .expectOne(
        'http://fake/Plone/@search?SearchableText=John&path.query=%2Ffolder1&path.depth=2'
      )
      .flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });
  it('should generate search query string contents', () => {
    expect(
      ResourceService.getSearchQueryString({
        portal_type: 'News Item',
        Subject: 'biology'
      })
    ).toBe('portal_type=News%20Item&Subject=biology');

    expect(
      ResourceService.getSearchQueryString({
        portal_type: ['Page', 'News Item']
      })
    ).toBe('portal_type=Page&portal_type=News%20Item');

    expect(
      ResourceService.getSearchQueryString(
        { portal_type: ['Page', 'News Item'] },
        { sort_on: 'sortable_title', sort_order: 'desc' }
      )
    ).toBe(
      'portal_type=Page&portal_type=News%20Item&sort_on=sortable_title&sort_order=desc'
    );

    expect(ResourceService.getSearchQueryString({ is_folderish: true })).toBe(
      'is_folderish=1'
    );

    expect(ResourceService.getSearchQueryString({ is_folderish: false })).toBe(
      'is_folderish=0'
    );

    expect(
      ResourceService.getSearchQueryString({
        created: new Date(Date.UTC(2018, 12 - 1, 29, 0, 0, 0))
      })
    ).toBe('created=2018-12-29T00%3A00%3A00.000Z');
  });
  it('should search contents in context', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@id': 'http://fake/Plone/folder1/@search',
      items: [
        {
          '@id': 'http://fake/Plone/folder1/page1',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'private',
          title: 'Welcome to Plone'
        }
      ],
      items_total: 1
    };

    service
      .find({ SearchableText: 'John' }, '/folder1')
      .subscribe((content: any) => {
        id = content.items[0]['@id'];
      });

    http
      .expectOne('http://fake/Plone/folder1/@search?SearchableText=John')
      .flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should sort search results', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@id': 'http://fake/Plone/@search',
      items: [
        {
          '@id': 'http://fake/Plone/folder1/page1',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'private',
          title: 'Welcome to Plone'
        }
      ],
      items_total: 1
    };
    service
      .find({ SearchableText: 'John' }, '', { sort_on: 'created' })
      .subscribe((content: any) => {
        id = content.items[0]['@id'];
      });

    http
      .expectOne(
        'http://fake/Plone/@search?SearchableText=John&sort_on=created'
      )
      .flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should filter by review state', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@id': 'http://fake/Plone/@search',
      items: [
        {
          '@id': 'http://fake/Plone/folder1/page1',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'private',
          title: 'Welcome to Plone'
        }
      ],
      items_total: 1
    };
    service
      .find({ SearchableText: 'John', review_state: 'private' }, '')
      .subscribe((content: any) => {
        id = content.items[0]['@id'];
      });

    http
      .expectOne(
        'http://fake/Plone/@search?SearchableText=John&review_state=private'
      )
      .flush(response);

    expect(id).toBe('http://fake/Plone/folder1/page1');
  });

  it('should add metadata to search results', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@id': 'http://fake/Plone/@search',
      items: [
        {
          '@id': 'http://fake/Plone/folder1/page1',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'private',
          title: 'Welcome to Plone'
        }
      ],
      items_total: 1
    };
    service
      .find({ SearchableText: 'John' }, '', {
        metadata_fields: ['Creator', 'CreationDate']
      })
      .subscribe((content: any) => {
        id = content.items[0]['@id'];
      });

    http
      .expectOne(
        'http://fake/Plone/@search?SearchableText=John&metadata_fields:list=Creator&metadata_fields:list=CreationDate'
      )
      .flush(response);

    id = 'http://fake/Plone/folder1/page1';
  });

  it('should create new content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
      '@type': 'Document',
      id: 'my-document',
      title: 'My Document'
    };

    service
      .create('/folder1', {
        '@type': 'Document',
        id: 'my-document',
        title: 'My Document'
      })
      .subscribe((content: any) => {
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

    service.delete('/page1').subscribe((content: any) => {
      received_content = content;
    });

    http.expectOne('http://fake/Plone/page1').flush(response);

    expect(received_content).toBe('passed');
  });

  it('should copy content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    const response = [
      {
        new: 'http://fake/Plone/copy_of_front-page',
        old: 'http://fake/Plone/front-page'
      }
    ];

    service
      .copy('/front-page', '/copy_of_front-page')
      .subscribe((content: any) => {
        received_content = content[0].new;
      });

    http
      .expectOne('http://fake/Plone/copy_of_front-page/@copy')
      .flush(response);

    expect(received_content).toBe('http://fake/Plone/copy_of_front-page');
  });

  it('should move content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    const response = [
      {
        new: 'http://fake/Plone/copy_of_front-page',
        old: 'http://fake/Plone/front-page'
      }
    ];

    service
      .move('/front-page', '/copy_of_front-page')
      .subscribe((content: any) => {
        received_content = content[0].new;
      });

    http
      .expectOne('http://fake/Plone/copy_of_front-page/@move')
      .flush(response);

    expect(received_content).toBe('http://fake/Plone/copy_of_front-page');
  });

  it('should change workflow state', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let state = 'invalid';
    const response = {
      action: 'publish',
      actor: 'admin',
      comments: '',
      review_state: 'published',
      time: '2016-10-21T19:05:00+00:00'
    };

    service.transition('/somepage', 'publish').subscribe((content: any) => {
      state = content.review_state;
    });

    http
      .expectOne('http://fake/Plone/somepage/@workflow/publish')
      .flush(response);

    expect(state).toBe('published');
    // TODO:  check verb and status code
  });

  it('should update content', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let received_content = 'invalid';
    const response = 'passed';

    service
      .update('/somepage', { title: 'New title' })
      .subscribe((content: any) => {
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
    let path = 'invalid';
    let url2 = 'invalid';
    let path2 = 'invalid';

    const response = {
      '@id': 'http://fake/Plone/front-page/@navigation',
      items: [
        {
          title: 'Home',
          '@id': 'http://fake/Plone'
        },
        {
          title: 'Welcome to Plone',
          '@id': 'http://fake/Plone/front-page'
        }
      ]
    };

    service.navigation().subscribe((items: NavLink[]) => {
      url = items[0].url;
      path = items[0].path;
      url2 = items[1].url;
      path2 = items[1].path;
    });

    http.expectOne('http://fake/Plone/@navigation').flush(response);

    expect(url).toBe('http://fake/Plone');
    expect(path).toBe('/');
    expect(url2).toBe('http://fake/Plone/front-page');
    expect(path2).toBe('/front-page');
  });

  it('should get breadcrumbs', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let title = 'invalid';
    const response = {
      '@id': 'http://fake/Plone/a-folder/test/@breadcrumbs',
      items: [
        {
          title: 'A folder',
          '@id': 'http://fake/Plone/a-folder'
        },
        {
          title: 'test',
          '@id': 'http://fake/Plone/a-folder/test'
        }
      ]
    };

    service.breadcrumbs('/a-folder/test').subscribe((items: NavLink[]) => {
      title = items[0].title;
    });

    http
      .expectOne('http://fake/Plone/a-folder/test/@breadcrumbs')
      .flush(response);

    expect(title).toBe('A folder');
  });

  it('should get vocabulary', () => {
    const service = TestBed.get(ResourceService);
    const http = TestBed.get(HttpTestingController);
    let vocabulary: Vocabulary<string> = new Vocabulary([]);
    const response = {
      '@id':
        'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes',
      terms: [
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Collection',
          title: 'Collection',
          token: 'Collection'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Discussion Item',
          title: 'Comment',
          token: 'Discussion Item'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Event',
          title: 'Event',
          token: 'Event'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/File',
          title: 'File',
          token: 'File'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Folder',
          title: 'Folder',
          token: 'Folder'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Image',
          title: 'Image',
          token: 'Image'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Link',
          title: 'Link',
          token: 'Link'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/News Item',
          title: 'News Item',
          token: 'News Item'
        },
        {
          '@id':
            'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes/Document',
          title: 'Page',
          token: 'Document'
        }
      ]
    };

    service
      .vocabulary('plone.app.vocabularies.ReallyUserFriendlyTypes')
      .subscribe((ruftVocabulary: Vocabulary<string>) => {
        vocabulary = ruftVocabulary;
      });

    http
      .expectOne(
        'http://fake/Plone/@vocabularies/plone.app.vocabularies.ReallyUserFriendlyTypes'
      )
      .flush(response);

    expect(vocabulary.terms().length).toBe(9);
    expect(vocabulary.byToken('Document').title).toBe('Page');
  });

  it(
    'should get a file upload',
    fakeAsync(() => {
      const blob: { [key: string]: any } = new Blob([''], { type: 'text/csv' });
      blob['name'] = 'filename.csv';

      const fakeF = <File>blob;
      let namedFile: NamedFileUpload = <NamedFileUpload>{};
      ResourceService.lightFileRead(fakeF).subscribe(
        (data: NamedFileUpload) => {
          namedFile = data;
          expect(namedFile.filename).toBe('filename.csv');
          expect(namedFile['content-type']).toBe('text/csv');
        }
      );
      tick();
    })
  );
});
