import {
  Component,
  effect,
  Input,
  input,
  OnChanges,
  Signal,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-global-notification',
  imports: [],
  templateUrl: './global-notification.component.html',
  styleUrl: './global-notification.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class GlobalNotificationComponent {
  visible = true;
  @Input() type!: 'success' | 'error' | 'warning' | undefined;
  @Input() message: string | undefined = '';
  @Input() duration!: number;

  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    setTimeout(() => (this.visible = true), 10); // tiny delay to trigger transition

    this.timeoutId = setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
