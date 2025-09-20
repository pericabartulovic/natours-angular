import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api-url.token';
import { loadStripe } from '@stripe/stripe-js';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
  ) {}

  async callCheckout(tourId: string) {
    const stripe = await loadStripe(
      'pk_test_51S93q3IvElR9HPrrMyuV6hcGdc9tfb5k8bj8Jz1QNgYuuzYWjQVwfg6Q0ECNPioiBKIGdIIqowMEkMqwYiQvqY2N001pmqyjb2',
    );

    this.http
      .post<{
        id: string;
        // url?: string;
      }>(
        `${this.apiUrl}/bookings/checkout-session/${tourId}`,
        {},
        { withCredentials: true },
      )
      .subscribe(async (session) => {
        // Either redirect with session.id:
        await stripe?.redirectToCheckout({ sessionId: session.id });

        // Or if returned session.url:
        // window.location.href = session.url;
      });
  }
}
