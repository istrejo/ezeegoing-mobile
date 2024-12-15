import { Component, inject } from '@angular/core';

import {
  faHouse,
  faCalendarDays,
  faCalendarCheck,
  faUser,
  faUserGroup,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../core/services/modal/modal.service';
import { BuildingModalComponent } from '../shared/components/building-modal/building-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  private modalSvc: ModalService = inject(ModalService);
  faHouse = faHouse;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;
  faUser = faUser;
  faBuilding = faBuilding;
  faUserGroup = faUserGroup;

  constructor() {}

  async openBuildingModal() {
    this.modalSvc.presentModal(BuildingModalComponent);
  }
}
