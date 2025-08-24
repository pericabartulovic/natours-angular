import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // Adjust path
import { API_URL } from '../api-url.token';
import { AuthResponse } from '../models/auth-response.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
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

  logIn(email: string, password: string) {
    let postData = { email: email, password: password };
    this.http
      .post<AuthResponse>(`${this.apiUrl}/users/login`, postData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.userSubject.next(res.user);
        },
        error: (err) => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);

          const backendMessage =
            err?.error?.message || 'Login failed, please try again.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
          });
        },
      });
  }

  logout() {
    this.http
      .get(`${this.apiUrl}/users/logout`, { withCredentials: true })
      .subscribe({
        next: () => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
        },
        error: (err) => {
          console.error('Logout failed:', err);
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
        },
      });
  }
}
