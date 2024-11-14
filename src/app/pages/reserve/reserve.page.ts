import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationType } from 'src/app/core/models/reservation.interface';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  private router: Router = inject(Router);
  reservationsTypes: ReservationType[] = [
    {
      id: 1,
      description: 'Reserva  para Visitante',
      type: 2,
    },
    {
      id: 2,
      description: 'Reserva para Parqueo',
      type: 1,
    },
    {
      id: 3,
      description: 'Reserva para Cargadores',
      type: 3,
    },
    {
      id: 4,
      description: 'Reserva para Areas Comunes',
      type: 4,
    },
    {
      id: 5,
      description: 'Reserva para Espacio de Trabajo',
      type: 5,
    },
    {
      id: 6,
      description: 'Reserva para Sala de Reunión',
      type: 6,
    },

    {
      id: 7,
      description: 'Reserva para Comedor',
      type: 7,
    },
  ];
  constructor() {}

  ngOnInit() {}

  onCreateReservation(reservationId: any) {
    console.log('Reservation selected ', reservationId);
    this.router.navigate(['tabs/create-reservation', reservationId]);
  }
}
