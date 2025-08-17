import { Routes } from '@angular/router';
import { OverviewComponent } from '../pages/home/overview/overview.component';

export const routes: Routes = [
  {
    path: 'tours',
    component: OverviewComponent,
    title: 'Natours | Exciting tours for adventurous people',
  },
  {
    path: 'tour/:tourId',
    loadComponent: () =>
      import('../pages/tour-details/tour-details.component').then(
        (m) => m.TourDetailsComponent,
      ),
    //TODO: resolve tourName === 'Natours | name of the tour',
  },
  {
    path: 'users',
    loadChildren: () => import('./user.routes').then((mod) => mod.routes),
  },
  { path: '**', redirectTo: '/tours' },
];
