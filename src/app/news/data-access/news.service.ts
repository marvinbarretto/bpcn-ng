import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewsSnippet } from '../utils/news/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsSnippet[]> {
    return this.http.get<NewsSnippet[]>('/api/news').pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ NewsService HTTP Error:', error.message);
        return throwError(
          () => new Error(`Failed to load news: ${error.message}`)
        );
      })
    );
  }
}
