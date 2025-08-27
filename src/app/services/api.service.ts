import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Tour } from '../models/tour.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { API_URL } from '../api-url.token';
import { environment } from '../../environments/environment';

interface TourResponse {
  status: string;
  tour: Tour;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  getTours(): Observable<Tour[]> {
    return this.http
      .get<{
        results: number;
        status: string;
        tours: Tour[];
      }>(`${this.apiUrl}/tours`)
      .pipe(
        map((response) => response.tours),
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => error);
        }),
      );
  }

  getTourById(tourId: string): Observable<Tour> {
    return this.http.get<TourResponse>(`${this.apiUrl}/tours/${tourId}`).pipe(
      map((response) => response.tour),
      catchError((error) => {
        if (environment.production) {
          return throwError(() => 'No tour find with that name');
        } else {
          console.error('API error:', error);
          return throwError(() => error);
        }
      }),
    );
  }
}
