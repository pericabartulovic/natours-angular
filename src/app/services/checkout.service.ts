import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from '../api-url.token';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private notificationService: NotificationService,
  ) {}

  async callCheckout(tourId: string) {
    try {
      const stripe = await loadStripe(
        'pk_test_51S93q3IvElR9HPrrMyuV6hcGdc9tfb5k8bj8Jz1QNgYuuzYWjQVwfg6Q0ECNPioiBKIGdIIqowMEkMqwYiQvqY2N001pmqyjb2',
      );

      // Await the HTTP call instead of subscribing
      const session = await firstValueFrom(
        this.http.post<{ id: string }>(
          `${this.apiUrl}/bookings/checkout-session/${tourId}`,
          {},
          { withCredentials: true },
        ),
      );

      // Either redirect with session.id OR: if returned session.url: window.location.href = session.url;
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error('Checkout error:', err);
      this.notificationService.notify({
        message: 'Something went wrong loading Stripe.',
        type: 'error',
        duration: 6000,
      });
    }
  }
}
