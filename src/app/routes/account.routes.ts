import { Routes } from '@angular/router';
import { AccountSettingsFormComponent } from '../pages/account/forms/account-settings-form/account-settings-form.component';
import { MyBookingsFormComponent } from '../pages/account/forms/my-bookings/my-bookings.component';
import { MyReviewsFormComponent } from '../pages/account/forms/my-reviews-form/my-reviews-form.component';
import { BillingFormComponent } from '../pages/account/forms/billing-form/billing-form.component';
import { ToursFormComponent } from '../pages/account/forms/tours-form/tours-form.component';
import { UsersFormComponent } from '../pages/account/forms/users-form/users-form.component';
import { ReviewsFormComponent } from '../pages/account/forms/reviews-form/reviews-form.component';
import { BookingsFormComponent } from '../pages/account/forms/bookings-form/bookings-form.component';

export const accRoutes: Routes = [
  { path: 'settings', component: AccountSettingsFormComponent },
  { path: 'my-bookings', component: MyBookingsFormComponent },
  { path: 'my-reviews', component: MyReviewsFormComponent },
  { path: 'billing', component: BillingFormComponent },
  { path: 'tours', component: ToursFormComponent },
  { path: 'tours/:tourId', component: ToursFormComponent },
  { path: 'users', component: UsersFormComponent },
  { path: 'reviews', component: ReviewsFormComponent },
  { path: 'bookings', component: BookingsFormComponent },
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
];
