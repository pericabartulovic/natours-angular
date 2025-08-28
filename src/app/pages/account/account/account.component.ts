import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { equalValues } from '../../../shared/validators/equal-values.validator';
import { SideNavComponent } from '../../../layout/side-nav/side-nav.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, SideNavComponent, AsyncPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  userName = '';
  email = '';

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

  formPasswords = new FormGroup(
    {
      passwordCurrent: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
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
  );

  constructor(
    public authService: AuthService,
    private userService: UserService,
  ) {}

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

  onSubmitPassword() {}
}
