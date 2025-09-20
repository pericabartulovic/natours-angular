import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { CheckoutService } from '../../services/checkout.service';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { OverviewBoxComponent } from '../../components/overview-box/overview-box.component';
import { SplitStringPipe } from '../../pipes/split.pipe';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { MapBoxComponent } from '../../components/map-box/map-box.component';

@Component({
  selector: 'app-tour-details',
  imports: [
    AsyncPipe,
    DatePipe,
    SplitStringPipe,
    OverviewBoxComponent,
    ReviewCardComponent,
    MapBoxComponent,
    RouterLink,
  ],
  templateUrl: './tour-details.component.html',
  styleUrl: './tour-details.component.scss',
})
export class TourDetailsComponent implements OnInit {
  tourId = input.required<string>();
  tour$!: Observable<Tour | null>;
  errorMsg = '';
  loading = false;
  descriptionParagraphs: String[] = [];

  constructor(
    public authService: AuthService,
    private checkoutService: CheckoutService,
    private tourService: TourService,
    private title: Title,
    private destroyRef: DestroyRef,
  ) {
    this.tour$ = this.tourService.tour$;
  }

  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe();
    this.tourService.getTourById(this.tourId());
    const subscription = this.tourService.tour$.subscribe({
      next: (tour) => {
        if (tour?.name) {
          this.title.setTitle(`Natours | ${tour.name}`);
        } else {
          this.title.setTitle('Natours | Tour Details');
        }
        this.loading = false;
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onBookTour(tourId: string) {
    this.checkoutService.callCheckout(tourId);
  }
}
