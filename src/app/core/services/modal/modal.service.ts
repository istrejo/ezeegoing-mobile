import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async presentModal(
    component: any,
    componentProps?: any
  ): Promise<HTMLIonModalElement> {
    const modal = await this.modalController.create({
      component,
      componentProps,
    });
    await modal.present();
    return modal;
  }

  async dismissModal(data?: any, role?: string, id?: string): Promise<boolean> {
    return this.modalController.dismiss(data, role, id);
  }
}
