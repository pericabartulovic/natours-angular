import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // Adjust path
import { API_URL } from '../api-url.token';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {}

  updateMe(name: string, email: string) {
    let postData = { name, email };
    this.http
      .patch(`${this.apiUrl}/users/updateMe`, postData, {
        withCredentials: true,
      })
      .subscribe({
        next: () =>
          this.notificationService.notify({
            message: 'Name / email successfully updated',
            type: 'success',
          }),
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

    // this.http
    //   .delete(`${this.apiUrl}/users/deleteMe`, { withCredentials: true })
    //   .subscribe({
    //     next: () => {
    //       this.router.navigate(['/tours']);
    //       this.notificationService.notify({
    //         message:
    //           "We're sad to see you leave. Your account has been permanently deleted.",
    //         type: 'success',
    //         duration: 5000,
    //       });
    //       // this.isLoggedInSubject.next(false);
    //       // this.userSubject.next(null);
    //     },
    //     error: (err) => {
    //       const backendMessage =
    //         err?.error?.message ||
    //         "We couldn't delete your account , please try again later.";
    //       this.notificationService.notify({
    //         message: backendMessage,
    //         type: 'error',
    //       });
    //     },
    //   });
  }
}
