import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Visitor } from 'src/app/core/models/visitor.state';
import { TabsService, VisitorTab } from '../../services/tabs.service';


@Component({
  selector: 'app-custom-visitor-tabs',
  templateUrl: './custom-visitor-tabs.component.html',
  styleUrls: ['./custom-visitor-tabs.component.scss'],
})
export class CustomVisitorTabsComponent {
  private tabsService = inject(TabsService);
  public currentTab = this.tabsService.currentTab;
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly swipeThreshold = 50;
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) skeletonItems: { id: number }[] = [];
  @Input({ required: true }) permanentVisitorsTemp: Visitor[] = [];
  @Input({ required: true }) temporalVisitorsTemp: Visitor[] = [];
  @Input({ required: true }) permanentVisitorsCount = 0;
  @Input({ required: true }) temporalVisitorsCount = 0;
  @Input({ required: true }) faUsers: any;

  @Output() createVisitor = new EventEmitter<void>();
  @Output() scroll = new EventEmitter<any>();

  onCreateVisitor() {
    this.createVisitor.emit();
  }

  onInfiniteScroll(event: any) {
    this.scroll.emit(event);
  }

  onTouchStart(event: TouchEvent) {
    const touch = event.changedTouches?.[0];
    if (!touch) {
      return;
    }

    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  onTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches?.[0];
    if (!touch) {
      return;
    }

    const diffX = touch.clientX - this.touchStartX;
    const diffY = touch.clientY - this.touchStartY;
    const isHorizontalSwipe =
      Math.abs(diffX) > this.swipeThreshold && Math.abs(diffX) > Math.abs(diffY);

    if (!isHorizontalSwipe) {
      return;
    }

    if (diffX < 0) {
      this.goToTab('temporal');
      return;
    }

    this.goToTab('permanent');
  }

  private goToTab(tab: VisitorTab) {
    if (this.currentTab() !== tab) {
      this.tabsService.setCurrentTab(tab);
    }
  }
}
