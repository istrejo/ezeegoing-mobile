import { Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private primengConfig = inject(PrimeNGConfig);
  constructor() {
    this.primengConfig.ripple = true;
  }
}
