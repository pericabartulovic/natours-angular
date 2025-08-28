import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // Adjust path
import { API_URL } from '../api-url.token';
import { AuthResponse } from '../models/auth-response.model';
import { NotificationService } from './notification.service';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
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
}
