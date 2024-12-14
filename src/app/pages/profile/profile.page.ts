import { selectAuthState } from './../../state/selectors/auth.selectors';
import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { logout } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private authservice = inject(AuthService);
  userInfo = null;
  private store = inject(Store);
  private alertCtrl = inject(AlertController);

  constructor() {}

  ngOnInit() {
    this.store.select(selectAuthState).subscribe((auth: any) => {
      console.log(auth);
      this.userInfo = auth;
    });
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
