import { Component } from '@angular/core';
import { OverviewComponent } from '../../../home/overview.component';

@Component({
  selector: 'app-my-bookings-form',
  imports: [OverviewComponent],
  templateUrl: './my-bookings-form.component.html',
  styleUrl: './my-bookings-form.component.scss',
})
export class MyBookingsFormComponent {}
