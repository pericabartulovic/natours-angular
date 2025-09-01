import { Routes } from '@angular/router';
import { accRoutes } from './account.routes';
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
    title: 'Natours | Login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Natours | Signup',
  },
  {
    path: 'me',
    component: AccountComponent,
    title: 'Natours | Your account',
    children: accRoutes,
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    title: 'Natours | Forgot Password?',
  },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent,
    title: 'Natours | Reset Password',
  },
];
