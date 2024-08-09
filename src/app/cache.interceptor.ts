import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);
    if (cachedResponse) {
      // Use `of` to return an Observable from a cached response
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          // Cache the response
          this.cache.set(req.urlWithParams, event);
        }
      })
    );
  }
}
