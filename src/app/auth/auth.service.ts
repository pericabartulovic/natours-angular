import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // Adjust path

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkAuth() {
    this.http.get<{ user: User }>('/api/users/me').subscribe({
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
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
    // call logout API if needed
  }
}
