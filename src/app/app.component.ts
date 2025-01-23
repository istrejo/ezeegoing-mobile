import { Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private platform = inject(Platform);
  private primengConfig = inject(PrimeNGConfig);
  constructor() {
    if (this.platform.is('hybrid')) {
      this.showSplash();
      this.setStatusBarStyleLight();
    }
    this.primengConfig.ripple = true;
  }

  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000,
    });
  }

  async setStatusBarStyleLight() {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
}
