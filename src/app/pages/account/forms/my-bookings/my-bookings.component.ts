import { Component } from '@angular/core';
import { OverviewComponent } from '../../../home/overview.component';

@Component({
  selector: 'app-my-bookings',
  imports: [OverviewComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsFormComponent {}
