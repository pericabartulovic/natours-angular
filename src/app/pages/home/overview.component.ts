import { Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Tour } from '../../models/tour.model';
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
export class OverviewComponent {
  $tours: Observable<Tour[]>;
  errorMsg = '';

  constructor(private apiService: ApiService) {
    this.$tours = this.apiService.getTours().pipe(
      catchError((err) => {
        this.errorMsg = 'Failed to load tours!';
        return of([]);
      }),
    );
  }
}
