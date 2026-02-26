import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorsPageRoutingModule } from './visitors-routing.module';

import { VisitorsPage } from './visitors.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardComponent } from './components/card/card.component';
import { ModalComponent } from './components/modal/modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectComponent } from '../../shared/components/select/select.component';
import { CustomVisitorTabsComponent } from './components/custom-visitor-tabs/custom-visitor-tabs.component';
import { TabButtonsComponent } from './components/tab-buttons/tab-buttons.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorsPageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule,
    SelectComponent,
  ],
  declarations: [
    VisitorsPage,
    CardComponent,
    ModalComponent,
    CustomVisitorTabsComponent,
    TabButtonsComponent
  ],
})
export class VisitorsPageModule {}
