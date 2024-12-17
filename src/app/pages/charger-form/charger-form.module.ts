import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChargerFormPageRoutingModule } from './charger-form-routing.module';

import { ChargerFormPage } from './charger-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChargerFormPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ChargerFormPage],
})
export class ChargerFormPageModule {}
