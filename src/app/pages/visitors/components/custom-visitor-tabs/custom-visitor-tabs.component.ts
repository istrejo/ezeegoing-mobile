import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { Visitor } from 'src/app/core/models/visitor.state';
import { TabsService } from '../../services/tabs.service';


@Component({
  selector: 'app-custom-visitor-tabs',
  templateUrl: './custom-visitor-tabs.component.html',
  styleUrls: ['./custom-visitor-tabs.component.scss'],
})
export class CustomVisitorTabsComponent {
  private tabsService = inject(TabsService);
  public currentTab = this.tabsService.currentTab;
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
}
