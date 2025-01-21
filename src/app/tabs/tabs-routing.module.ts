import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'visitors',
        loadChildren: () =>
          import('../pages/visitors/visitors.module').then(
            (m) => m.VisitorsPageModule
          ),
      },
      {
        path: 'reserve',
        loadChildren: () =>
          import('../pages/reserve/reserve.module').then(
            (m) => m.ReservePageModule
          ),
      },
      {
        path: 'reservations',
        loadChildren: () =>
          import('../pages/reservations/reservations.module').then(
            (m) => m.ReservationsPageModule
          ),
      },
      {
        path: 'create-reservation/:id/:name',
        loadChildren: () =>
          import('../pages/create-reservation/create-reservation.module').then(
            (m) => m.CreateReservationPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/reserve',
        pathMatch: 'full',
      },
      {
        path: 'charger-form',
        loadChildren: () =>
          import('../pages/charger-form/charger-form.module').then(
            (m) => m.ChargerFormPageModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/reserve',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
