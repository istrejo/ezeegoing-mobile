import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReservationPageRoutingModule } from './create-reservation-routing.module';

import { CreateReservationPage } from './create-reservation.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectComponent } from 'src/app/shared/components/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateReservationPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SelectComponent,
  ],
  declarations: [CreateReservationPage],
})
export class CreateReservationPageModule {}
