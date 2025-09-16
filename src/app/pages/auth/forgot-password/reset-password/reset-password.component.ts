import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { compareValues } from '../../../../shared/validators/values.validator';
import { BtnPassVisibleComponent } from '../../../../components/shared/btn-pass-visible/btn-pass-visible.component';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    BtnPassVisibleComponent,
    ControlErrorDirective,
  ],
  providers: [{ provide: FORM_ERROR_MESSAGES, useValue: defaultErrorMessages }],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  loading = false;

  form = new FormGroup({
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        passwordConfirm: new FormControl('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
      },
      {
        validators: [
          compareValues('password', 'passwordConfirm', 'passValidator'),
        ],
      },
    ),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  get passwordsGroup() {
    return this.form.get('passwords') as FormGroup;
  }

  onSubmit() {
    this.loading = true;
    const token = this.activatedRoute.snapshot.paramMap.get('token');

    this.authService.resetPassword(
      this.form.controls.passwords.controls.password.value!,
      this.form.controls.passwords.controls.passwordConfirm.value!,
      token!,
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
}
