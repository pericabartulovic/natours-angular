import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

  signUp(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) {
    let postData = { name, email, password, passwordConfirm };
    this.http
      .post<AuthResponse>(`${this.apiUrl}/users/signup`, postData)
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.userSubject.next(res.user);
          this.notificationService.notify({
            message: "🎉 Account created! You're all set to start exploring 🚀",
            type: 'success',
          });
        },
        error: (err) => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);

          const backendMessage =
            err?.error?.message ||
            'Something went wrong during signup, please try again.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
            duration: 5000,
          });
        },
      });
  }

  logIn(email: string, password: string) {
    let postData = { email, password };
    this.http
      .post<AuthResponse>(`${this.apiUrl}/users/login`, postData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.userSubject.next(res.user);
          this.notificationService.notify({
            message: 'Login successful!',
            type: 'success',
          });
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

  sendResetLink(email: string) {
    this.http.post(`${this.apiUrl}/users/forgotPassword`, { email }).subscribe({
      next: () =>
        this.notificationService.notify({
          message: 'Check your email!',
          type: 'success',
          duration: 4000,
        }),
      error: (err) => {
        const backendMessage =
          err?.error?.message || 'Login failed, please try again.';
        this.notificationService.notify({
          message: backendMessage,
          type: 'error',
        });
      },
    });
  }

  resetPassword(password: string, passwordConfirm: string, token: string) {
    this.http
      .patch<AuthResponse>(`${this.apiUrl}/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      })
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.userSubject.next(res.user);
          this.notificationService.notify({
            message: 'Password successfully set!',
            type: 'success',
            duration: 4000,
          });
        },
        error: (err) => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);

          const backendMessage =
            err?.error?.message ||
            'Resetting password failed, please try again later.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
          });
        },
      });
  }
}
