import { Component, Input } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input({ required: true }) tour!: Tour;
}
