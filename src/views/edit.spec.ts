import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import {
  SchemaFormModule,
  WidgetRegistry,
  DefaultWidgetRegistry
} from 'angular2-schema-form';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { CommentsService } from '../comments.service';
import { NavigationService } from '../navigation.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { EditView } from './edit';
import { CacheService } from '../cache.service';
import { LoadingService } from '../loading.service';

describe('EditView', () => {
  let component: EditView;
  let fixture: ComponentFixture<EditView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditView],
      imports: [HttpClientTestingModule, TraversalModule, SchemaFormModule],
      providers: [
        APIService,
        AuthenticationService,
        CacheService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        CommentsService,
        LoadingService,
        NavigationService,
        ResourceService,
        TypeMarker,
        RESTAPIResolver,
        Services,
        PloneViews,
        Traverser,
        { provide: Resolver, useClass: RESTAPIResolver },
        { provide: Marker, useClass: TypeMarker },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('edit', '*', EditView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get search results according to querystring params', () => {
    const http = TestBed.get(HttpTestingController);
    const response_document = {
      "@id": "http://fake/Plone/somepage",
      "@type": "Document",
      "id": "somepage",
      "text": {
        "content-type": "text/plain",
        "data": "If you're seeing this instead of the web site you were expecting, the owner of this web site has just installed Plone. Do not contact the Plone Team or the Plone mailing lists about this.",
        "encoding": "utf-8"
      },
      "title": "Welcome to Plone"
    };
    const response_type = {
      "fieldsets": [
        {
          "fields": [
            "title",
            "description",
            "text",
            "changeNote"
          ],
          "id": "default",
          "title": "Default"
        },
        {
          "fields": [
            "allow_discussion",
            "exclude_from_nav",
            "id",
            "table_of_contents"
          ],
          "id": "settings",
          "title": "Settings"
        },
        {
          "fields": [
            "subjects",
            "language",
            "relatedItems"
          ],
          "id": "categorization",
          "title": "Categorization"
        },
        {
          "fields": [
            "effective",
            "expires"
          ],
          "id": "dates",
          "title": "Dates"
        },
        {
          "fields": [
            "creators",
            "contributors",
            "rights"
          ],
          "id": "ownership",
          "title": "Ownership"
        }
      ],
      "layouts": [
        "document_view"
      ],
      "properties": {
        "allow_discussion": {
          "choices": [
            [
              "True",
              "Yes"
            ],
            [
              "False",
              "No"
            ]
          ],
          "description": "Allow discussion for this content object.",
          "enum": [
            "True",
            "False"
          ],
          "enumNames": [
            "Yes",
            "No"
          ],
          "title": "Allow discussion",
          "type": "string"
        },
        "changeNote": {
          "description": "Enter a comment that describes the changes you made.",
          "title": "Change Note",
          "type": "string"
        },
        "contributors": {
          "additionalItems": true,
          "description": "The names of people that have contributed to this item. Each contributor should be on a separate line.",
          "items": {
            "description": "",
            "title": "",
            "type": "string"
          },
          "title": "Contributors",
          "type": "array",
          "uniqueItems": true
        },
        "creators": {
          "additionalItems": true,
          "description": "Persons responsible for creating the content of this item. Please enter a list of user names, one per line. The principal creator should come first.",
          "items": {
            "description": "",
            "title": "",
            "type": "string"
          },
          "title": "Creators",
          "type": "array",
          "uniqueItems": true
        },
        "description": {
          "description": "Used in item listings and search results.",
          "minLength": 0,
          "title": "Summary",
          "type": "string",
          "widget": "textarea"
        },
        "effective": {
          "description": "If this date is in the future, the content will not show up in listings and searches until this date.",
          "title": "Publishing Date",
          "type": "string",
          "widget": "datetime"
        },
        "exclude_from_nav": {
          "default": false,
          "description": "If selected, this item will not appear in the navigation tree",
          "title": "Exclude from navigation",
          "type": "boolean"
        },
        "expires": {
          "description": "When this date is reached, the content will no longer be visible in listings and searches.",
          "title": "Expiration Date",
          "type": "string",
          "widget": "datetime"
        },
        "id": {
          "description": "This name will be displayed in the URL.",
          "title": "Short name",
          "type": "string"
        },
        "relatedItems": {
          "additionalItems": true,
          "default": [],
          "description": "",
          "items": {
            "description": "",
            "title": "Related",
            "type": "string"
          },
          "title": "Related Items",
          "type": "array",
          "uniqueItems": true
        },
        "rights": {
          "description": "Copyright statement or other rights information on this item.",
          "minLength": 0,
          "title": "Rights",
          "type": "string",
          "widget": "textarea"
        },
        "subjects": {
          "additionalItems": true,
          "description": "Tags are commonly used for ad-hoc organization of content.",
          "items": {
            "description": "",
            "title": "",
            "type": "string"
          },
          "title": "Tags",
          "type": "array",
          "uniqueItems": true
        },
        "table_of_contents": {
          "description": "If selected, this will show a table of contents at the top of the page.",
          "title": "Table of contents",
          "type": "boolean"
        },
        "text": {
          "description": "",
          "title": "Text",
          "type": "string",
          "widget": "richtext"
        },
        "title": {
          "description": "",
          "title": "Title",
          "type": "string"
        }
      },
      "required": [
        "title",
        "exclude_from_nav"
      ],
      "title": "Page",
      "type": "object"
    };

    component.services.traverser.traverse('/somepage/@@edit');
    const req_document = http.expectOne('http://fake/Plone/somepage');
    req_document.flush(response_document);
    const req_type = http.expectOne('http://fake/Plone/@types/Document');
    req_type.flush(response_type);
    component.services.traverser.target.filter(target => {
      return Object.keys(target.context).length > 0;
    })
      .subscribe(target => {
        expect(component.model.title).toBe('Welcome to Plone');
        expect(component.schema.title).toBe('Page');
        expect(component.schema.properties.expires.widget).toBe('date');
      });
  });
});
