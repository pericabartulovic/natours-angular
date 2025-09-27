import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-error',
  imports: [],
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
})
export class ControlErrorComponent {
  @Input() text = '';
}
