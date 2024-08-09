import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CacheInterceptor } from './cache.interceptor';

describe('CacheInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CacheInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(interceptor => interceptor instanceof CacheInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should cache the response', () => {
    const testUrl = '/data';
    const testData = { name: 'Test' };

    // First request
    httpClient.get(testUrl).subscribe(response => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(testData);

    // Second request, should hit the cache
    httpClient.get(testUrl).subscribe(response => {
      expect(response).toEqual(testData);
    });

    // No new requests should be made to the server
    httpMock.expectNone(testUrl);
  });

  it('should bypass cache on POST requests', () => {
    const testUrl = '/data';
    const testData = { name: 'Test' };

    httpClient.post(testUrl, testData).subscribe(response => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(testData);

    // Cache should not be hit for POST requests
    httpClient.post(testUrl, testData).subscribe(response => {
      expect(response).toEqual(testData);
    });

    const postReq = httpMock.expectOne(testUrl);
    postReq.flush(testData);
  });
});
