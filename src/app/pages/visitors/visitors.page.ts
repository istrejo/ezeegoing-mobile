import { Component, inject, OnInit, signal } from '@angular/core';
import { faBuilding, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { BuildingModalComponent } from 'src/app/shared/components/building-modal/building-modal.component';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import {
  selectVisitors,
  selectVisitorsLoading,
} from 'src/app/state/selectors/visitor.selectors';
import { ModalComponent } from './components/modal/modal.component';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.page.html',
  styleUrls: ['./visitors.page.scss'],
})
export class VisitorsPage implements OnInit {
  private modalSvc: ModalService = inject(ModalService);
  private store = inject(Store);
  faBuilding = faBuilding;
  faCalendarDays = faCalendarDays;
  public visitors = signal<Visitor[]>([]);
  public visitorsTemp = signal<Visitor[]>([]);
  public permanentVisitors = signal<Visitor[]>([]);
  public permanentVisitorsTemp = signal<Visitor[]>([]);
  public temporalVisitors = signal<Visitor[]>([]);
  public temporalVisitorsTemp = signal<Visitor[]>([]);
  public isLoading = signal<boolean>(false);
  public search = '';
  public faUsers = faUsers;
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

  /**
   * The ngOnInit function calls the loadData method to initialize data when the component is
   * initialized.
   */
  ngOnInit() {
    this.loadData();
  }

  /**
   * The `openBuildingModal` function presents a modal with the `BuildingModalComponent`.
   */

  openBuildingModal() {
    this.modalSvc.presentModal(BuildingModalComponent);
  }

  /**
   * The `loadData` function in TypeScript subscribes to the `selectVisitors` and `selectVisitorsLoading`
   * selectors, dispatches an action to load visitors if the list is empty, and organizes visitors into
   * permanent and temporal categories.
   */
  loadData() {
    this.store.select(selectVisitors).subscribe((visitors) => {
      if (!visitors.length) {
        this.store.dispatch(loadVisitors());
      }
    });
    this.store.select(selectVisitors).subscribe((visitors) => {
      this.permanentVisitors.set(
        visitors.filter((item) => item.is_permanent === true)
      );
      this.temporalVisitors.set(visitors.filter((item) => !item.is_permanent));

      if (this.search.trim()) {
        this.onSearch();
      } else {
        this.permanentVisitorsTemp.set(this.permanentVisitors());
        this.temporalVisitorsTemp.set(this.temporalVisitors());
      }
    });
    this.store
      .select(selectVisitorsLoading)
      .subscribe((loading) => this.isLoading.set(loading));
  }

  /**
   * The `onSearch` function filters and updates lists of permanent and temporal visitors based on a
   * search query.
   * @returns If the search input is empty or only contains whitespace characters, the function will set
   * the `permanentVisitorsTemp` and `temporalVisitorsTemp` to the original lists of permanent and
   * temporal visitors respectively, and then return.
   */
  onSearch() {
    const search = this.search.toLowerCase();

    if (!search.trim()) {
      this.permanentVisitorsTemp.set(this.permanentVisitors());
      this.temporalVisitorsTemp.set(this.temporalVisitors());
      return;
    }

    this.permanentVisitorsTemp.update((prev) =>
      this.permanentVisitors()
        .filter((item: any) => item.fullname?.toLowerCase().includes(search))
        .slice(0, this.limit)
    );

    this.temporalVisitorsTemp.update((prev) =>
      this.temporalVisitors()
        .filter((item: any) => item.fullname?.toLowerCase().includes(search))
        .slice(0, this.limit)
    );
  }

  /**
   * The `onScroll` function dynamically loads more data based on a search query or increases the limit
   * of displayed items when scrolling.
   * @param {any} event - The `event` parameter in the `onScroll` function is an object that represents
   * the event triggered by the scrolling action. In this case, it is used to determine when the
   * scrolling action is complete so that the function can perform certain actions, such as updating the
   * list of visitors being displayed.
   */
  onScroll(event: any): void {
    const search = this.search.toLocaleLowerCase();
    if (search.trim()) {
      this.limit += 10;
      this.visitorsTemp.set(
        this.visitors()
          .filter((data: Visitor): any => data.fullname?.includes(search))
          .slice(0, this.limit)
      );
    } else if (this.limit < this.visitors().length) {
      this.limit += 10;
      this.visitorsTemp.set(this.visitors().slice(0, this.limit));
    }
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  /**
   * The `createVisitor` function opens a modal window displaying the `ModalComponent`.
   */
  createVisitor() {
    this.modalSvc.presentModal(ModalComponent);
  }

  /**
   * The `handleRefresh` function dispatches an action to load visitors and completes a refresh event
   * after a delay of 1500 milliseconds.
   * @param {any} event - The `event` parameter in the `handleRefresh` function is typically an event
   * object that is passed when a user triggers a refresh action, such as pulling down on a list to
   * refresh its content. In this case, it is used to complete the refresh action after a delay of 1500
   * milliseconds
   */
  handleRefresh(event: any) {
    this.store.dispatch(loadVisitors());
    setTimeout(() => event.target.complete(), 1500);
  }
}
