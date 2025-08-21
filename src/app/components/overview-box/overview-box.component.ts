import { Component, input } from '@angular/core';

@Component({
  selector: 'app-overview-box',
  imports: [],
  templateUrl: './overview-box.component.html',
  styleUrl: './overview-box.component.scss',
})
export class OverviewBoxComponent {
  label = input<string>();
  text = input<string | null>();
  icon = input<string>();
}
