import { Component, inject } from '@angular/core';

import {
  faHouse,
  faCalendarDays,
  faCalendarCheck,
  faUser,
  faUserGroup,
  faBuilding,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  faHouse = faHouse;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;
  faHome = faHome;
  faUser = faUser;
  faBuilding = faBuilding;
  faUserGroup = faUserGroup;

  constructor() {}
}
