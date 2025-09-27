import { Routes } from '@angular/router';
import { AccountSettingsFormComponent } from '../pages/account/forms/account-settings-form/account-settings-form.component';
import { MyBookingsComponent } from '../pages/account/my-bookings/my-bookings.component';
import { MyReviewsComponent } from '../pages/account/my-reviews/my-reviews.component';
import { MyBillingComponent } from '../pages/account/my-billing/my-billing.component';
import { ToursFormComponent } from '../pages/account/forms/tours-form/tours-form.component';
import { UsersFormComponent } from '../pages/account/forms/users-form/users-form.component';
import { ReviewsFormComponent } from '../pages/account/forms/reviews-form/reviews-form.component';
import { BookingsFormComponent } from '../pages/account/forms/bookings-form/bookings-form.component';

export const accRoutes: Routes = [
  { path: 'settings', component: AccountSettingsFormComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'my-reviews', component: MyReviewsComponent },
  { path: 'billing', component: MyBillingComponent },
  { path: 'tours', component: ToursFormComponent },
  { path: 'tours/:tourId', component: ToursFormComponent },
  { path: 'users', component: UsersFormComponent },
  { path: 'reviews', component: ReviewsFormComponent },
  { path: 'bookings', component: BookingsFormComponent },
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
];
