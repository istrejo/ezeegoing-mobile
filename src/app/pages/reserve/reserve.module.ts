import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservePageRoutingModule } from './reserve-routing.module';

import { ReservePage } from './reserve.page';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { RippleModule } from 'primeng/ripple';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservePageRoutingModule,
    RippleModule,
    FontAwesomeModule,
  ],
  declarations: [ReservePage, ReservationCardComponent],
})
export class ReservePageModule {}
