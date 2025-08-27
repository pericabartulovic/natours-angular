import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

// multi-input validators factory
function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    return val1 === val2 ? null : { valuesNotEqual: true };
  };
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  loading = false;

  form = new FormGroup({
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        passwordConfirm: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [equalValues('password', 'passwordConfirm')],
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

  get passwordIsInvalid() {
    return (
      this.form.controls.passwords.controls.password.touched &&
      this.form.controls.passwords.controls.password.dirty &&
      this.form.controls.passwords.controls.password.invalid
    );
  }

  get passwordConfirmIsInvalid() {
    return (
      this.form.controls.passwords.controls.passwordConfirm.touched &&
      this.form.controls.passwords.controls.passwordConfirm.dirty &&
      this.form.controls.passwords.controls.passwordConfirm.invalid
    );
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
}
