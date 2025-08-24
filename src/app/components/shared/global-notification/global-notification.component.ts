import { Component } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { NotificationService } from '../../../services/notification.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-global-notification',
  imports: [AsyncPipe],
  templateUrl: './global-notification.component.html',
  styleUrl: './global-notification.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class GlobalNotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
