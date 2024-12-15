import { inject, Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertController: AlertController = inject(AlertController);

  constructor() {}

  async presentAlert({
    header,
    subHeader,
    message,
    buttons,
    backdropDismiss,
  }: AlertOptions) {
    const alert = await this.alertController.create({
      backdropDismiss,
      header,
      subHeader,
      message,
      buttons,
    });

    await alert.present();
  }

  dissmisAlert() {
    this.alertController.dismiss();
  }
}
