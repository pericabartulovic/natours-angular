import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { BtnPassVisibleComponent } from '../../../../components/shared/btn-pass-visible/btn-pass-visible.component';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BtnPassVisibleComponent,
    ControlErrorDirective,
  ],
  providers: [{ provide: FORM_ERROR_MESSAGES, useValue: defaultErrorMessages }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private statusSub!: Subscription;
  loading = false;
  emailOrPasswordIsInvalid = signal<boolean>(true); // for practicing purposes only...

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.statusSub = this.form.statusChanges.subscribe(() => {
      this.emailOrPasswordIsInvalid.set(
        this.form.controls.email.invalid || this.form.controls.password.invalid,
      );
    });
  }

  onSubmit() {
    this.loading = true;

    this.authService.logIn(
      this.form.controls.email.value!,
      this.form.controls.password.value!,
    );

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.loading = false;

      if (loggedIn) {
        setTimeout(() => this.router.navigate(['/tours']), 1000);
      }
    });
  }

  togglePasswordVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }
}
