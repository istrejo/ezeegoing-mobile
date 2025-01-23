import { loadReservations } from './../../state/actions/reservation.actions';
import { selectReservations } from './../../state/selectors/reservation.selectors';
import { Component, inject, OnInit, signal } from '@angular/core';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Building } from 'src/app/core/models/building.state';
import { UserData } from 'src/app/core/models/user.state.intercafe';

import { logout } from 'src/app/state/actions/auth.actions';
import { loadBuildings } from 'src/app/state/actions/building.actions';
import { loadUser } from 'src/app/state/actions/user.actions';
import { selectCurrentBuilding } from 'src/app/state/selectors/building.selectors';
import {
  selectUser,
  selectUserLoading,
} from 'src/app/state/selectors/user.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user = signal<UserData | null>(null);
  public building = signal<Building | any>(null);
  private store = inject(Store);
  private alertCtrl = inject(AlertController);
  public isloading = signal(false);
  public reservations = signal(0);
  faBuilding = faBuilding;

  constructor() {}

  /**
   * The ngOnInit function calls the loadData method to initialize data when the component is
   * initialized.
   */
  ngOnInit() {
    this.loadData();
  }

  /**
   * The `loadData` function subscribes to various selectors in the store to retrieve user, building, and
   * reservations data, dispatching actions to load data if necessary.
   */
  loadData() {
    this.store.select(selectUser).subscribe((user) => {
      this.user.set(user);
      if (!user) {
        this.store.dispatch(loadUser());
      }
    });

    this.store.select(selectCurrentBuilding).subscribe((building) => {
      this.building.set(building);
      if (!building) {
        this.store.dispatch(loadBuildings());
      }
    });

    this.store.select(selectReservations).subscribe((reservations) => {
      if (!reservations.length) {
        this.store.dispatch(loadReservations());
      }

      this.reservations.set(reservations.length);
    });

    this.store
      .select(selectUserLoading)
      .subscribe((loading) => this.isloading.set(loading));
  }

  /**
   * The `logout` function dispatches a `logout` action using the store.
   */
  logout() {
    this.store.dispatch(logout());
  }

  /**
   * The `presentAlert` function in TypeScript presents an iOS-style alert asking the user if they want
   * to log out.
   */
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Cerrar sesión',
      message: '¿Desea cerrar su sesión de usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * The handleRefresh function in TypeScript triggers a refresh event and loads new data after a delay
   * of 1500 milliseconds.
   * @param {any} event - The `event` parameter in the `handleRefresh` function is typically an event
   * object that is triggered when a user initiates a refresh action, such as pulling down on a list to
   * refresh its content. This event object contains information about the event that occurred, such as
   * the target element that triggered the
   */
  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1500);
    this.loadData();
  }
}
