import { Component, inject, OnInit, signal } from '@angular/core';
import { faBuilding, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { VisitorService } from 'src/app/core/services/visitor/visitor.service';
import { BuildingModalComponent } from 'src/app/shared/components/building-modal/building-modal.component';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import {
  selectVisitors,
  selectVisitorsLoading,
} from 'src/app/state/selectors/visitor.selectors';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.page.html',
  styleUrls: ['./visitors.page.scss'],
})
export class VisitorsPage implements OnInit {
  private modalSvc: ModalService = inject(ModalService);
  private store = inject(Store);
  private visitorService = inject(VisitorService);
  faBuilding = faBuilding;
  faCalendarDays = faCalendarDays;
  public visitors = signal<Visitor[]>([]);
  public visitorsTemp = signal<Visitor[]>([]);
  public isLoading = signal<boolean>(false);
  public search = '';
  limit = 10;

  skeletonItems = [
    {
      id: 1,
    },
    {
      id: 2,
    },

    {
      id: 3,
    },

    {
      id: 4,
    },

    {
      id: 5,
    },

    {
      id: 6,
    },
  ];

  constructor() {}

  ngOnInit() {}
  async openBuildingModal() {
    this.modalSvc.presentModal(BuildingModalComponent);
  }

  ionViewWillEnter() {
    this.store.select(selectVisitors).subscribe((visitors) => {
      if (!visitors.length) {
        this.store.dispatch(loadVisitors());
      }
    });
    this.store.select(selectVisitors).subscribe((visitors) => {
      this.visitors.set(visitors);
      this.visitorsTemp.set(visitors.slice(0, this.limit));
    });
    this.store
      .select(selectVisitorsLoading)
      .subscribe((loading) => this.isLoading.set(loading));
  }

  onSearch() {
    const search = this.search.toLowerCase();
    this.limit = 10;

    if (!search.trim()) {
      this.visitorsTemp.set(this.visitors().slice(0, this.limit));
      return;
    }

    this.visitorsTemp.update((prev) =>
      this.visitors()
        .filter((item: any) => item.fullname?.toLowerCase().includes(search))
        .slice(0, this.limit)
    );
  }

  createVisitor() {
    this.modalSvc.presentModal(ModalComponent);
  }

  deleteVisitor(id: number) {
    this.visitorService.deleteVisitor(id).subscribe((res) => console.log(res));
  }

  handleRefresh(event: any) {
    this.store.dispatch(loadVisitors());
    setTimeout(() => event.target.complete(), 1500);
  }
}
