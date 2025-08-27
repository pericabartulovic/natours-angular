import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    return val1 === val2 ? null : { valuesNotEqual: true };
  };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  loading = false;

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
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
  ) {}

  get passwordsGroup() {
    return this.form.get('passwords') as FormGroup;
  }

  get nameIsEmpty() {
    return (
      this.form.controls.name.touched &&
      this.form.controls.name.dirty &&
      this.form.controls.name.invalid
    );
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
    this.authService.signUp(
      this.form.controls.name.value!,
      this.form.controls.email.value!,
      this.form.controls.passwords.controls.password.value!,
      this.form.controls.passwords.controls.passwordConfirm.value!,
    );

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.loading = false;

      if (loggedIn) {
        setTimeout(() => this.router.navigate(['/tours']), 1000);
      }
    });
  }
}
