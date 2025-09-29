import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  environment = environment;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.checkAuth();
  }
  handleLogout() {
    this.authService.logout();
    this.authService.isLoggedIn$.subscribe((loggedOut) => {
      if (loggedOut) {
        setTimeout(() => this.router.navigate(['/tours']), 1000);
      }
    });
  }
}
