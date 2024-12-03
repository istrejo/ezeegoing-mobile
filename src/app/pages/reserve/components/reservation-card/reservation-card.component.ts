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
      case 1:
        return (this.iconUrl = 'parking.svg');
      case 2:
        return (this.iconUrl = 'visit.svg');
      case 3:
        return (this.iconUrl = 'charger.svg');

      default:
        return (this.iconUrl = 'help');
    }
  }
}
