import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Building } from 'src/app/core/models/building.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  loadBuildings,
  selectBuilding,
} from 'src/app/state/actions/building.actions';
import {
  selectBuildings,
  selectBuildingSelected,
} from 'src/app/state/selectors/building.selectors';

@Component({
  selector: 'app-building-modal',
  templateUrl: './building-modal.component.html',
  styleUrls: ['./building-modal.component.scss'],
})
export class BuildingModalComponent implements OnInit {
  private modalSvc: ModalService = inject(ModalService);
  private store: Store = inject(Store);
  public buildings = signal<Building[]>([]);
  buildingSelected$ = new Observable();

  constructor() {}

  /**
   * The `ngOnInit` function dispatches an action to load buildings, subscribes to the buildings state,
   * and sets the retrieved buildings data.
   */
  ngOnInit() {
    this.store.dispatch(loadBuildings());
    this.store.select(selectBuildings).subscribe((res) => {
      console.log('Buildings: ', res);
      this.buildings.set(res);
    });
    this.buildingSelected$ = this.store.select(selectBuildingSelected);
  }

  /* The `SelectBuilding(buildingId: number)` function in the `BuildingModalComponent` class is a method
that is used to dispatch an action to select a specific building based on the `buildingId` provided
as a parameter. */
  SelectBuilding(buildingId: number) {
    this.store.dispatch(selectBuilding({ buildingId }));
  }

  /**
   * The close function dismisses a modal using the modal service.
   */
  close() {
    this.modalSvc.dismissModal();
  }
}
