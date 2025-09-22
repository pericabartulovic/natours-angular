import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-overview',
  imports: [AsyncPipe, CardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  host: {
    class: 'cards-container',
  },
})
export class OverviewComponent implements OnInit {
  tours$!: Observable<Tour[]>;
  errorMsg = '';

  constructor(
    private tourService: TourService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('/my-bookings')) {
      this.tours$ = this.tourService.getTours().pipe(
        catchError((err) => {
          this.errorMsg = 'Failed to load tours! Please try later again.';
          return of([]);
        }),
      );
    } else {
      this.tours$ = this.tourService.getMyBookings();
    }
  }
}
