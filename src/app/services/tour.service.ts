import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { API_URL } from '../api-url.token';
import { Tour } from '../models/tour.model';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

interface TourResponse {
  status: string;
  tour: Tour;
}

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private tourSubject = new BehaviorSubject<Tour | null>(null);
  tour$: Observable<Tour | null> = this.tourSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
    private router: Router,
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

  getTourById(tourId: string) {
    this.http
      .get<TourResponse>(`${this.apiUrl}/tours/${tourId}`)
      .pipe(map((response) => response.tour))
      .subscribe({
        next: (tour) => {
          this.tourSubject.next(tour);
        },
        error: (err) => {
          const backendMessage =
            err?.error?.message || 'Failed to load tour details.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
          });
          setTimeout(() => this.router.navigate(['/tours']), 3000);
        },
      });
  }

  createTour(formData: FormData) {
    return this.http.post(`${this.apiUrl}/tours`, formData, {
      withCredentials: true,
    });
  }
}
