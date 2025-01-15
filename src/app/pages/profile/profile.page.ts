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

  ngOnInit() {
    this.store.select(selectUser).subscribe((user) => {
      console.log(user);
      this.user.set(user);
      if (!user) {
        this.store.dispatch(loadUser());
      }
    });

    this.store.select(selectCurrentBuilding).subscribe((building) => {
      console.log('Current building: ', building);
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

  logout() {
    this.store.dispatch(logout());
  }

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
}
