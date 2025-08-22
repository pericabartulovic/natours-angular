import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {
  NotificationService,
  Notification,
} from './services/notification.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { GlobalNotificationComponent } from './components/shared/global-notification/global-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    GlobalNotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  notification?: Notification;
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe({
      next: (notif) => {
        this.notification = notif;
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
