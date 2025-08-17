import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  imports: [],
  templateUrl: './tour-details.component.html',
  styleUrl: './tour-details.component.scss',
})
export class TourDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const tourId = this.route.snapshot.paramMap.get('tourId');
    // or subscribe to this.route.paramMap for changes
  }

  //TODO: After finishing logic for fetching add resolver for title in routes
}
