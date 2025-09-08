import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { API_URL } from '../api-url.token';

@Injectable({
  providedIn: 'root',
})
export class TourService implements OnInit {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  ngOnInit(): void {
    // console.log(this.tour);
  }

  saveNewTour(formData: FormData) {
    return this.http.post(`${this.apiUrl}/tours`, formData, {
      withCredentials: true,
    });
  }
}
