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
import { equalValues } from '../../../shared/validators/values.validator';
import { SideNavComponent } from '../../../layout/side-nav/side-nav.component';
import { BtnPassVisibleComponent } from '../../../components/shared/btn-pass-visible/btn-pass-visible.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [SideNavComponent, AsyncPipe, RouterOutlet],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe();
  }
}
