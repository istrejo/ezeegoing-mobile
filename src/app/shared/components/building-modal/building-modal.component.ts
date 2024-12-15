import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
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
  public buildingSelected: number | null = null;

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

    this.store.select(selectBuildingSelected).subscribe((res) => {
      this.buildingSelected = res;
      this.buildingSelected = parseInt(
        localStorage.getItem('buildingId') || 'null'
      );
    });
  }

  /* The `SelectBuilding(buildingId: number)` function in the `BuildingModalComponent` class is a method
that is used to dispatch an action to select a specific building based on the `buildingId` provided
as a parameter. */
  SelectBuilding(buildingId: number) {
    if (this.buildingSelected === null) {
      this.close();
    }
    localStorage.setItem('buildingId', buildingId.toString());
    this.store.dispatch(selectBuilding({ buildingId }));
  }

  /**
   * The close function dismisses a modal using the modal service.
   */
  close() {
    this.modalSvc.dismissModal();
  }
}
