import { Component, input } from '@angular/core';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
})
export class ReviewCardComponent {
  review = input.required<Review>();
}
