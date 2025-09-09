import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { API_URL } from '../api-url.token';
import { Tour } from '../models/tour.model';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface TourResponse {
  status: string;
  tour: Tour;
}

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

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

  createTour(formData: FormData) {
    return this.http.post(`${this.apiUrl}/tours`, formData, {
      withCredentials: true,
    });
  }
}
