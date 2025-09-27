import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wip',
  imports: [],
  templateUrl: './wip.component.html',
  styleUrl: './wip.component.scss',
})
export class WipComponent {
  @Input() title: string | undefined = '';
}
