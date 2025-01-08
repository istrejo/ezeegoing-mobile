import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import {
  Reservation,
  ReservationType,
} from '../../models/reservation.interface';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiSvc = inject(ApiService);

  constructor() {}

  getAll(): Observable<Reservation[]> {
    return this.apiSvc
      .get<Reservation[]>('reservation/', { context: checkToken() })
      .pipe(
        map((reservations) =>
          reservations.map((item) => ({
            ...item,
            fullname: `${item.first_name} ${item.last_name}`,
          }))
        )
      );
  }

  getTypes(): Observable<ReservationType[]> {
    return this.apiSvc.get<ReservationType[]>('reservation-type/', {
      context: checkToken(),
    });
  }

  createReservation(dto: any): Observable<any> {
    return this.apiSvc.post('reservation/', dto, { context: checkToken() });
  }

  createChargerReservation(dto: any): Observable<any> {
    return this.apiSvc.post('bolt-badge/', dto, { context: checkToken() });
  }

  delete(id: number): Observable<any> {
    return this.apiSvc.delete(`reservation/${id}/`, { context: checkToken() });
  }

  update(id: any, dto: any): Observable<any> {
    return this.apiSvc.put(`reservation/${id}/`, dto, {
      context: checkToken(),
    });
  }
}
