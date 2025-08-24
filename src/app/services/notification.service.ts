import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Notification {
  message: string | undefined;
  type: 'success' | 'error' | 'warning' | undefined;
  duration?: number; // optional, defaults to 5000
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification | null>();
  notification$: Observable<Notification | null> =
    this.notificationSubject.asObservable();

  private timeoutId?: ReturnType<typeof setTimeout>;

  notify(notification: Notification) {
    clearTimeout(this.timeoutId);
    this.notificationSubject.next(notification);

    this.timeoutId = setTimeout(
      () => this.notificationSubject.next(null),
      notification.duration ?? 3000,
    );
  }
}
