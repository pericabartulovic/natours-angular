import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { equalValues } from '../../../shared/validators/equal-values.validator';
import { SideNavComponent } from '../../../layout/side-nav/side-nav.component';
import { BtnPassVisibleComponent } from '../../../components/shared/btn-pass-visible/btn-pass-visible.component';

@Component({
  selector: 'app-account',
  imports: [
    ReactiveFormsModule,
    SideNavComponent,
    AsyncPipe,
    BtnPassVisibleComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  userName = '';
  email = '';

  constructor(
    public authService: AuthService,
    private userService: UserService,
  ) {}

  // User data update
  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      updateOn: 'change',
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'change',
    }),
  });

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userName = user.name;
        this.email = user.email;
        this.form.patchValue({
          name: user.name,
          email: user.email,
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || this.form.pristine) return;

    const { name, email } = this.form.value;
    const trimmedName = name!.trim();
    const trimmedEmail = email!.trim();

    if (trimmedName === this.userName && trimmedEmail === this.email) {
      return;
    }

    this.userService.updateMe(trimmedName, trimmedEmail);
  }

  // Password update
  formPasswords = new FormGroup(
    {
      passwordCurrent: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      passwordConfirm: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    },
    {
      validators: [equalValues('password', 'passwordConfirm')],
    },
  );

  get passwordCurrentIsInvalid() {
    return (
      this.formPasswords.controls.passwordCurrent.touched &&
      this.formPasswords.controls.passwordCurrent.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.formPasswords.controls.password.touched &&
      this.formPasswords.controls.password.invalid
    );
  }

  get passwordConfirmIsInvalid() {
    return (
      this.formPasswords.controls.passwordConfirm.touched &&
      this.formPasswords.controls.passwordConfirm.invalid
    );
  }

  onSubmitPassword() {
    this.authService.updatePassword(
      this.formPasswords.controls.passwordCurrent.value!,
      this.formPasswords.controls.password.value!,
      this.formPasswords.controls.passwordConfirm.value!,
    );
  }
}
