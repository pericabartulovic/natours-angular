import { Component, inject, input, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { Tour } from '../../models/tour.model';
import { OverviewBoxComponent } from '../../components/overview-box/overview-box.component';
import { SplitStringPipe } from '../../pipes/split.pipe';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { ResolveFn } from '@angular/router';
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
  ],
  templateUrl: './tour-details.component.html',
  styleUrl: './tour-details.component.scss',
})
export class TourDetailsComponent implements OnInit {
  tourId = input.required<string>();
  $tour?: Observable<Tour | undefined>;
  errorMsg = '';
  loading = false;
  descriptionParagraphs: String[] = [];

  constructor(
    private apiService: ApiService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.$tour = this.apiService.getTourById(this.tourId()).pipe(
      tap((tour) => {
        this.loading = false; // clear loading on success
        // Set document title dynamically
        if (tour?.name) {
          this.title.setTitle(`Natours | ${tour.name}`);
        } else {
          this.title.setTitle('Natours | Tour Details');
        }
      }),
      catchError((err) => {
        this.errorMsg = err.error?.message || 'Failed to load tour details.';
        this.loading = false;
        return of(undefined);
      }),
    );
  }
}
