import { Component } from '@angular/core';
import { OverviewComponent } from '../../home/overview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../../services/checkout.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-my-bookings',
  imports: [OverviewComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsComponent {
  private sessionId: string | null = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private checkoutService: CheckoutService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.sessionId = this.activatedRoute.snapshot.queryParams['session_id'];
  }

  ngOnInit(): void {
    if (!this.sessionId) return;

    this.checkoutService.retrievePaymentStatus(this.sessionId).subscribe({
      next: (res) => {
        res.payment_status === 'paid'
          ? this.notificationService.notify({
              message:
                'Your booking was successful! Please check your email for confirmation.',
              type: 'success',
            })
          : this.notificationService.notify({
              message:
                "If your booking doesn't show up here immediately, please check your email and come back later",
              type: 'warning',
              duration: 6000,
            });
        this.router.navigate([], {
          queryParams: { session_id: null },
          queryParamsHandling: 'merge',
        });
      },
      error: (err) => {
        const backendMessage =
          err?.error?.message || 'Failed to load tour details.';
        this.notificationService.notify({
          message: backendMessage,
          type: 'error',
        });

        this.router.navigate([], {
          queryParams: { session_id: null },
          queryParamsHandling: 'merge',
        });
      },
    });
  }
}
