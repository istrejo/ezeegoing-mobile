import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargerFormPage } from './charger-form.page';

const routes: Routes = [
  {
    path: '',
    component: ChargerFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargerFormPageRoutingModule {}
