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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

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
    public userService: UserService,
    private dialog: MatDialog,
    private router: Router,
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
    photo: new FormControl<File | null>(null),
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ photo: file });
      this.form.get('photo')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    const { name, email, photo } = this.form.value;

    const formData = new FormData();
    formData.append('name', name!.trim());
    formData.append('email', email!.trim());
    if (photo) formData.append('photo', photo);

    this.userService.updateMe(formData);
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

  onDeleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to permanently delete your account?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteMe().subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/tours']);
          },
          error: (err) => console.error('Error deleting account', err),
        });
      }
    });
  }
}
