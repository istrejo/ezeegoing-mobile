import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { catchError, Observable, of } from 'rxjs';
import {
  Reservation,
  ReservationDto,
} from '../../models/reservation.interface';
import { HttpClient } from '@angular/common/http';
import { body } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiSvc = inject(ApiService);

  constructor() {}

  getAll(): Observable<Reservation[]> {
    return this.apiSvc.get('reservation/', {
      // params: {
      //   badge: 3,
      // },
    });
  }

  createReservation(dto: any): Observable<any> {
    return this.apiSvc.post('reservation/', dto);
  }

  delete(id: number): Observable<any> {
    return of();
  }

  update() {}
}
