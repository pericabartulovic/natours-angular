import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  error = '';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.logIn(
      this.form.controls.email.value!,
      this.form.controls.password.value!,
    );

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.loading = false;

      if (loggedIn) {
        setTimeout(() => this.router.navigate(['/tours']), 1000);
      } else {
        this.error = 'Login failed, please try again.';
      }
    });
    // } catch (err) {
    //   alertStore.showAlert('error',err.response?.data?.message || 'Login failed. Please try again.')
    // } finally {
    //   loading.value = false
  }
}
