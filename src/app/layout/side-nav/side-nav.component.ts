import { Component, EventEmitter, input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  role = input.required<string>();
  @Output() checkboxCheck = new EventEmitter<void>();

  onLinkClick() {
    this.checkboxCheck.emit();
  }
}
