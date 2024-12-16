import { Component, Input, OnInit } from '@angular/core';
import { Reservation } from 'src/app/core/models/reservation.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() type!: number;
  @Input() reservation!: Reservation;

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
}
