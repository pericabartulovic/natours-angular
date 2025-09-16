import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { SideNavComponent } from '../../../layout/side-nav/side-nav.component';
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
