import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // Adjust path
import { API_URL } from '../api-url.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  checkAuth() {
    this.http
      .get<{ user: User }>(`${this.apiUrl}/users/me`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.userSubject.next(res.user);
        },
        error: () => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
        },
      });
  }

  logout() {
    this.http.get(`${this.apiUrl}/users/logout`);
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
  }
}
