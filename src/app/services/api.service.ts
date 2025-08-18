import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Tour } from '../models/tour.model';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api-url.token';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => error);
      }),
    );
  }

  getTourById(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => error);
      }),
    );
  }
}
