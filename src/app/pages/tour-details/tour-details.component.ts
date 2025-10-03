import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { CheckoutService } from '../../services/checkout.service';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { OverviewBoxComponent } from '../../components/overview-box/overview-box.component';
import { SplitStringPipe } from '../../pipes/split.pipe';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { MapBoxComponent } from '../../components/map-box/map-box.component';
import { CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    CarouselModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './tour-details.component.html',
  styleUrl: './tour-details.component.scss',
})
export class TourDetailsComponent implements OnInit {
  environment = environment;
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
    private destroyRef: DestroyRef
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
      error: (err) => {
        const backendMessage =
          err?.error?.message || 'Failed to load tour details.';
        this.errorMsg = backendMessage;
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onBookTour(tourId: string) {
    this.checkoutService.callCheckout(tourId);
  }

  responsiveOptions = [
    {
      breakpoint: '1367px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '1025px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '561px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
