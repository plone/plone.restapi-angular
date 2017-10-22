/* tslint:disable:no-unused-variable */

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingService, LoadingInterceptor } from './loading.service';
import { APIService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';

describe('APIService', () => {

  let service: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        LoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        {
          provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://fake/Plone',
        }}
      ]
    });

    service = TestBed.get(APIService);

  });


  it('should make a get request to the configured backend url',
     inject([HttpClient, HttpTestingController],
     (http: HttpClient, httpMock: HttpTestingController) => {

    // fake response
    const response = {
      'dummykey': 'dummyvalue',
    };

    service
      .get('/data')
      .subscribe(data => expect(data['dummykey']).toEqual('dummyvalue'));

    const req = httpMock.expectOne('http://fake/Plone/data');
    req.flush(response);
    httpMock.verify();

  }));

  it('should reflect the loading status of the loading service http interceptor in its own status',
     fakeAsync(inject([HttpClient, HttpTestingController],
     (http: HttpClient, httpMock: HttpTestingController) => {

    // fake response
    const response = {
      'dummykey': 'dummyvalue',
    };

    // initially the loading status is false
    expect(service.status.getValue()).toEqual({ loading: false });

    service
      .get('/data')
      .subscribe(data => expect(data['dummykey']).toEqual('dummyvalue'));

    tick(); // wait for async to complete
    // At this point, the request is pending, and no response has been
    // received.
    expect(service.status.getValue()).toEqual({ loading: true });

    const req = httpMock.expectOne('http://fake/Plone/data');

    // Next, fulfill the request by transmitting a response.
    req.flush(response);
    httpMock.verify();

    expect(service.status.getValue()).toEqual({ loading: false });

  })));

});
