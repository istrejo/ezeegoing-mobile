import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorsPageRoutingModule } from './visitors-routing.module';

import { VisitorsPage } from './visitors.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardComponent } from './components/card/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorsPageRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [VisitorsPage, CardComponent],
})
export class VisitorsPageModule {}
