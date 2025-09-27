import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-btn-pass-visible',
  imports: [],
  templateUrl: './btn-pass-visible.component.html',
  styleUrl: './btn-pass-visible.component.scss',
})
export class BtnPassVisibleComponent {
  @Input({ required: true }) input!: HTMLInputElement;

  togglePasswordVisibility(): void {
    this.input.type = this.input.type === 'password' ? 'text' : 'password';
  }
}
