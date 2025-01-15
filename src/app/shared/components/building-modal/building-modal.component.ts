import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
  effect,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Building } from 'src/app/core/models/building.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  changeBuilding,
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
  public buildingSelected = signal<number | null>(null);

  public firstTime: boolean = false;

  constructor() {}

  /**
   * The `ngOnInit` function dispatches actions to load buildings, subscribes to select building data,
   * and updates the component's state accordingly.
   */
  ngOnInit() {
    this.store.dispatch(loadBuildings());
    this.store.select(selectBuildings).subscribe((res) => {
      this.buildings.set(res);
    });

    this.store.select(selectBuildingSelected).subscribe((res) => {
      this.buildingSelected.set(res);
      this.firstTime = !this.buildingSelected();
    });
  }

  /**
   * The SelectBuilding function selects a building by dispatching an action with the buildingId and
   * storing it in localStorage.
   * @param {number} buildingId - The `buildingId` parameter is a number that represents the unique
   * identifier of the building that is being selected in the `SelectBuilding` function. This identifier
   * is used to dispatch an action to select the building and also stored in the local storage for future
   * reference.
   */
  SelectBuilding(building: Building) {
    if (this.firstTime) {
      this.close();
    }
    this.store.dispatch(selectBuilding({ buildingId: building.id }));
    this.store.dispatch(changeBuilding({ building }));
    localStorage.setItem('buildingId', building.id.toString());
    localStorage.setItem('currentBuilding', JSON.stringify(building));
  }

  /**
   * The close function dismisses a modal using the modal service.
   */
  close() {
    this.modalSvc.dismissModal();
  }
}
