import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Reservation } from 'src/app/core/models/reservation.interface';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { EditReservationModalComponent } from 'src/app/shared/components/edit-reservation-modal/edit-reservation-modal.component';
import { deleteReservation } from 'src/app/state/actions/reservation.actions';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() type!: number;
  @Input() reservation!: Reservation;
  private alertService = inject(AlertService);
  private store: Store = inject(Store);
  private modalCtrl = inject(ModalController);

  iconUrl: string = '';
  title: string = '';

  constructor() {}

  ngOnInit() {
    this.getIcon();
  }

  getIcon() {
    switch (this.reservation.reservation_type_id) {
      case 1:
        this.iconUrl = 'common-areas.svg';
        this.title = 'Reserva para Areas Comunes';
        break;
      case 2:
        this.iconUrl = 'visit.svg';
        this.title = 'Reserva para Visitante';
        break;

      case 3:
        this.iconUrl = 'charger.svg';
        this.title = 'Reserva para Cargadores';

        break;
      case 4:
        this.iconUrl = 'workspace.svg';
        this.title = 'Reserva para Espacio de trabajo';

        break;
      case 5:
        this.iconUrl = 'meeting.svg';
        this.title = 'Reserva para Sala de Reunión';

        break;
      case 6:
        this.iconUrl = 'parking.svg';
        this.title = 'Reserva para Parqueo';
        break;

      case 7:
        this.iconUrl = 'restaurant.svg';
        this.title = 'Reserva para Comedor ';
        break;
      default:
        this.iconUrl = 'visit.svg';
    }
  }

  async onEdit() {
    const modal = await this.modalCtrl.create({
      component: EditReservationModalComponent,
      componentProps: {
        reservation: this.reservation,
      },
    });

    await modal.present();
  }

  deleteReservation() {
    this.alertService.presentAlert({
      mode: 'ios',
      header: 'Eliminar reservación',
      message: '¿Está seguro que desea eliminar la reservación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Call the deleteReservation action
            this.store.dispatch(
              deleteReservation({ reservationId: this.reservation.id })
            );
          },
        },
      ],
    });
  }
}
