import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Notification {
  message: string | undefined;
  type: 'success' | 'error' | 'warning' | undefined;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$: Observable<Notification> =
    this.notificationSubject.asObservable();

  notify(notification: Notification) {
    this.notificationSubject.next(notification);
  }
}
