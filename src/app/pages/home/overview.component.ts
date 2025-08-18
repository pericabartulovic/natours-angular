import { Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-overview',
  imports: [AsyncPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  $tours: Observable<Tour[]>;
  errorMsg = '';

  constructor(private apiService: ApiService) {
    this.$tours = this.apiService.getTours();
    this.$tours.subscribe({
      next: (tours) => {
        console.log('Fetched tours:', tours);
      },
      error: (err) => {
        console.error('Error fetching tours', err);
      },
    });

    // this.$tours = this.apiService.getTours().pipe(
    //   catchError((err) => {
    //     this.errorMsg = 'Failed to load tours!';
    //     return of([]);
    //   }),
    // );
  }
}
