import { Component, inject, Input } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, DatePipe, AsyncPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input({ required: true }) tour!: Tour;
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.user$.subscribe();
  }

  onEditTour() {
    this.router.navigate([`/users/me/tours/${this.tour._id}`]);
  }
}
