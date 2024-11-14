import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  /* The `presentLoading` method in the `LoadingService` class is responsible for displaying a loading
indicator on the screen. It creates a loading overlay using the `LoadingController` provided by
Ionic Framework. The method takes an optional `message` parameter which defaults to 'Cargando...'
(Spanish for 'Loading...'). */
  async presentLoading(message: string = 'Cargando...') {
    console.log(message);
    this.loading = await this.loadingController.create({
      message,
    });
    await this.loading.present();
  }

  /**
   * The function dismisses a loading indicator if it is currently displayed.
   */
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
