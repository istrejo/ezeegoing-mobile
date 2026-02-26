import { Component, inject, Input, OnInit, signal, computed } from '@angular/core';
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
import { ToastController } from '@ionic/angular';
import { WalletService } from 'src/app/core/services/wallet.service';
import { firstValueFrom } from 'rxjs';
import { CapacitorPassToWallet } from 'capacitor-pass-to-wallet';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

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
  private loading = inject(LoadingService);
  private toastController = inject(ToastController);
  private walletService = inject(WalletService);
  public types = signal<ReservationType[]>([]);
  public iconUrl: string = '';
  
  
  public canAddToWallet = computed(() => {
    return this.reservation?.is_active 
  });

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

  async onAddToWallet() {
    try {
      this.loading.present();
      const blob = await firstValueFrom(this.walletService.getPassFile(this.reservation.id));
      const dataUrl = (await this.walletService.convertBlobToBase64(blob)) as string;
      const commaIdx = dataUrl.indexOf(',');
      const base64 = commaIdx >= 0 ? dataUrl.substring(commaIdx + 1) : dataUrl;
      await CapacitorPassToWallet.addToWallet({ base64 });
      this.loading.dismiss();
    } catch (err: any) {
      this.loading.dismiss();
      let errorObject = JSON.parse(err.errorMessage);
      let message = ''


      if (errorObject?.message === 'Pass already added') {
        message = 'El pase ya existe en tu Apple Wallet';
      } else {
        message = errorObject?.message;
      }

      const toast = await this.toastController.create({
        message: message,
        duration: 2500,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
