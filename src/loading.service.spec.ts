import { HttpClient } from '@angular/common/http';
import { TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingService, LoadingInterceptor } from './loading.service';

describe('LoadingService', () => {

  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
      ]
    });

    service = TestBed.get(LoadingService);

  });

  it('should be in loading state during loading', () => {
    service.begin('test-1');
    expect(service.status.getValue()).toBe(true);
  });

  it('should be in loading state loading stopped', () => {
    service.begin('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false);
  });

  it('should be robust on multiple loading starts', () => {
    service.begin('test-1');
    service.begin('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false);
  });

  it('should be robust on multiple loading finished', () => {
    service.begin('test-1');
    service.finish('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false);
  });

  it('should handle loading of several apps', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(true);
  });

  it('should finish all apps', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish();
    expect(service.status.getValue()).toBe(false);
  });

  it('should know if an app is loading', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish('test-1');
    service.isLoading('test-1').subscribe((isLoading) => {
      expect(isLoading).toBe(false);
    });
    service.isLoading('test-2').subscribe((isLoading) => {
      expect(isLoading).toBe(true);
    });
  });

  it('should handle the setting of loading status (begin and finish) in the http interceptor',
     fakeAsync(inject([HttpClient, HttpTestingController],
     (http: HttpClient, httpMock: HttpTestingController) => {

    // fake response
    const response = {
      'dummykey': 'dummyvalue',
    };

    http
      .get('/data')
      .subscribe(data => expect(data['dummykey']).toEqual('dummyvalue'));

    // At this point, the request is pending, and no response has been
    // received.
    expect(service.status.getValue()).toBe(true);
    let subscriber1 = service.isLoading('GET-/data').subscribe((isLoading) => {
      expect(isLoading).toBe(true);
    });
    tick(); // wait for async to complete before unsubscribing
    subscriber1.unsubscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('GET');

    // Next, fulfill the request by transmitting a response.
    req.flush(response);
    httpMock.verify();

    expect(service.status.getValue()).toBe(false);
    let subscriber2 = service.isLoading('GET-/data').subscribe((isLoading) => {
      expect(isLoading).toBe(false);
    });
    tick(); // wait for async to complete before unsubscribing
    subscriber2.unsubscribe();

  })));

});
