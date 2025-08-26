import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/auth/login/login/login.component';
import { SignupComponent } from '../pages/auth/signup/signup/signup.component';
import { AccountComponent } from '../pages/account/account/account.component';
import { ForgotPasswordComponent } from '../pages/auth/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../pages/auth/forgot-password/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'me',
    component: AccountComponent,
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent,
  },
];
