import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { compareValues } from '../../../../shared/validators/values.validator';
import { BtnPassVisibleComponent } from '../../../../components/shared/btn-pass-visible/btn-pass-visible.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../../../../components/shared/confirm-dialog/confirm-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../../models/user.model';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';

@Component({
  selector: 'app-account-settings-form',
  imports: [
    ReactiveFormsModule,
    BtnPassVisibleComponent,
    AsyncPipe,
    ControlErrorDirective,
  ],
  templateUrl: './account-settings-form.component.html',
  providers: [{ provide: FORM_ERROR_MESSAGES, useValue: defaultErrorMessages }],
  styleUrl: './account-settings-form.component.scss',
})
export class AccountSettingsFormComponent implements OnInit {
  user$!: Observable<User | null>;
  photoPreview: string | ArrayBuffer | null = null;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.user$ = this.authService.user$;
  }

  // User data update form
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
    this.user$.subscribe((user) => {
      if (user) {
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

    if (input) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(input.files![0]);
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

  // Password update form
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
      validators: [
        compareValues('password', 'passwordConfirm', 'passValidator'),
      ],
    },
  );

  onSubmitPassword() {
    this.authService.updatePassword(
      this.formPasswords.controls.passwordCurrent.value!,
      this.formPasswords.controls.password.value!,
      this.formPasswords.controls.passwordConfirm.value!,
    );

    this.formPasswords.reset();
  }

  onDeleteAccount() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete your account? This action cannot be undone.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAccount();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Your account is safe.',
        });
      },
    });
  }

  deleteAccount() {
    this.userService.deleteMe().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/tours']);
      },
      error: (err) => console.error('Error deleting account', err),
    });
  }
}
