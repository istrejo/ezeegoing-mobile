import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent implements OnInit {
  @Input() id!: number;
  @Input() description!: string;
  @Input() type!: number;
  @Output() reservationToCreate: EventEmitter<any> = new EventEmitter();
  iconUrl: string = '';

  constructor() {}

  ngOnInit() {
    this.getIcon();
  }

  selectReservation() {
    this.reservationToCreate.emit(this.type);
  }

  getIcon() {
    switch (this.type) {
      case 2:
        this.iconUrl = 'visit.svg';
        break;
      case 1:
        this.iconUrl = 'parking.svg';
        break;
      case 3:
        this.iconUrl = 'common-areas.svg';
        break;
      case 4:
        this.iconUrl = 'workspace.svg';
        break;
      case 5:
        this.iconUrl = 'meeting.svg';
        break;
      case 6:
        this.iconUrl = 'charger.svg';
        break;
      case 7:
        this.iconUrl = 'restaurant.svg';
        break;
      default:
        this.iconUrl = 'help';
    }
  }
}
