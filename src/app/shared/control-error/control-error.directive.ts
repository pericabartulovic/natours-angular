import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  ComponentRef,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FORM_ERROR_MESSAGES } from './form-errors';
import { ControlErrorComponent } from './control-error/control-error.component';

@Directive({
  selector: '[appControlError]',
})
export class ControlErrorDirective implements OnInit, OnDestroy {
  private control = inject(NgControl, { optional: true });
  private vcr = inject(ViewContainerRef);
  private errorMessages = inject(FORM_ERROR_MESSAGES);
  private sub?: Subscription;
  private componentRef?: ComponentRef<ControlErrorComponent>;

  ngOnInit() {
    if (!this.control) return;

    this.sub = this.control.statusChanges?.subscribe(() => {
      this.updateError();
    });
  }

  private updateError() {
    if (!this.control) return;
    const errors = this.control.errors;
    const touched = this.control.touched || this.control.dirty;

    if (errors && touched) {
      const firstKey = Object.keys(errors)[0];
      const message = this.errorMessages[firstKey] || 'Invalid value';
      this.showError(message);
    } else {
      this.clearError();
    }
  }

  private showError(message: string) {
    if (!this.componentRef) {
      this.componentRef = this.vcr.createComponent(ControlErrorComponent);
    }
    this.componentRef.instance.text = message;
  }

  private clearError() {
    this.componentRef?.destroy();
    this.componentRef = undefined;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
