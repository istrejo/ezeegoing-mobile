import { Injectable, signal } from '@angular/core';

export type VisitorTab = 'permanent' | 'temporal';


@Injectable({
  providedIn: 'root'
})
export class TabsService {
  currentTab = signal<VisitorTab>('permanent');

  setCurrentTab(tab: VisitorTab) {
    this.currentTab.set(tab);
  }
}
