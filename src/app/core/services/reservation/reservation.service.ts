import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import {
  Reservation,
  ReservationType,
} from '../../models/reservation.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiSvc = inject(ApiService);

  constructor() {}

  getAll(): Observable<Reservation[]> {
    return this.apiSvc.get<Reservation[]>('reservation/').pipe(
      map((reservations) =>
        reservations.map((item) => ({
          ...item,
          fullname: `${item.first_name} ${item.last_name}`,
        }))
      )
    );
  }

  getTypes(): Observable<ReservationType[]> {
    return this.apiSvc.get<ReservationType[]>('reservation-type/');
  }

  createReservation(dto: any): Observable<any> {
    return this.apiSvc.post('reservation/', dto);
  }

  createChargerReservation(dto: any): Observable<any> {
    return this.apiSvc.post('bolt-badge/', dto);
  }

  delete(id: number): Observable<any> {
    return this.apiSvc.delete('reservation/', {
      params: {
        id,
      },
    });
  }

  update() {}
}
