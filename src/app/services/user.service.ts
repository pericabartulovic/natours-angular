import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { API_URL } from '../api-url.token';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  updateMe(formData: FormData) {
    this.http
      .patch<User>(`${this.apiUrl}/users/updateMe`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.notificationService.notify({
            message: 'Changes successfully updated',
            type: 'success',
          });
          this.userSubject.next(res);
          this.authService.checkAuth();
        },
        error: (err) => {
          const backendMessage =
            err?.error?.message ||
            'Something went wrong during updating name or email, please try again.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
          });
        },
      });
  }

  deleteMe() {
    return this.http
      .delete(`${this.apiUrl}/users/deleteMe`, { withCredentials: true })
      .pipe(
        switchMap(() =>
          this.http.get(`${this.apiUrl}/users/logout`, {
            withCredentials: true,
          }),
        ),
        tap(() => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
          this.notificationService.notify({
            message:
              "We're sad to see you leave. Your account has been permanently deleted.",
            type: 'success',
            duration: 5000,
          });
        }),
      );
  }
}
