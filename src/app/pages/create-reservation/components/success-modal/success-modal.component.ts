import { IonicModule, ModalController } from '@ionic/angular';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadReservations } from 'src/app/state/actions/reservation.actions';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private store = inject(Store);
  constructor() {}

  ngOnInit() {}

  /**
   * The close function dismisses the modal control.
   */
  close() {
    // TODO: este método debe dirigir al usuario a una vista con el detalle de su reserva.
    this.store.dispatch(loadReservations());
    this.router.navigate(['tabs/reservations']);
    this.modalCtrl.dismiss();
  }
}
