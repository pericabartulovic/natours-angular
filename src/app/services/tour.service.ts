import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Tour } from '../models/tour.model';
import { API_URL } from '../api-url.token';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class TourService implements OnInit {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // console.log(this.tour);
  }

  saveNewTour(payload: any) {
    return this.http.post(`${this.apiUrl}/tours`, payload, {
      withCredentials: true,
    });
  }
}
