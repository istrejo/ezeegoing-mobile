import { Component, inject, OnInit, output } from '@angular/core';
import { TabsService, VisitorTab } from '../../services/tabs.service';



@Component({
  selector: 'app-tab-buttons',
  templateUrl: './tab-buttons.component.html',
  styleUrls: ['./tab-buttons.component.scss'],
})
export class TabButtonsComponent   {
  private tabsService = inject(TabsService);
  public currentTab = this.tabsService.currentTab;

  setActiveTab(tab: VisitorTab) {
    this.tabsService.setCurrentTab(tab);
  }

}
