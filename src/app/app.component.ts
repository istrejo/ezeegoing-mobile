import { Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private primengConfig = inject(PrimeNGConfig);
  constructor() {
    this.primengConfig.ripple = true;
    this.showSplash();
  }

  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000,
    });
  }
}
