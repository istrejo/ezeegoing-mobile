import { Component } from '@angular/core';

import {
  faHouse,
  faCalendarDays,
  faCalendarCheck,
  faUser,
  faUsers,
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
  faUser = faUser;
  faUsers = faUsers;

  constructor() {}
}
