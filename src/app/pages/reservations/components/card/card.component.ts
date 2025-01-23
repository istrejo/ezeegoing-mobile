import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  Reservation,
  ReservationType,
} from 'src/app/core/models/reservation.interface';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { EditReservationModalComponent } from 'src/app/shared/components/edit-reservation-modal/edit-reservation-modal.component';
import { loadReservationTypes } from 'src/app/state/actions/reservation-type.actions';
import { deleteReservation } from 'src/app/state/actions/reservation.actions';
import { selectReservationTypes } from 'src/app/state/selectors/reservation-type.selectors';

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
  public types = signal<ReservationType[]>([]);
  public iconUrl: string = '';

  constructor() {}

  ngOnInit() {
    this.getIcon();
    this.store.select(selectReservationTypes).subscribe((reservationsTypes) => {
      if (!reservationsTypes.length) {
        this.store.dispatch(loadReservationTypes());
      }
      this.types.set(reservationsTypes);
    });
  }

  getIcon() {
    switch (this.reservation.reservation_type_id) {
      case 1:
        this.iconUrl = 'building.svg';
        break;
      case 2:
        this.iconUrl = 'visit.svg';
        break;

      case 3:
        this.iconUrl = 'charger.svg';

        break;
      default:
        this.iconUrl = 'common-areas.svg';
    }
  }

  async onEdit() {
    const typeCatalogs = this.types().find(
      (item) => item.id === this.reservation.reservation_type_id
    )?.type_catalogs;
    if (!!typeCatalogs) {
      console.log('Type catalogs: ', typeCatalogs);
      localStorage.setItem('typeCatalogs', JSON.stringify(typeCatalogs));
    }
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
