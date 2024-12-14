import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReservationType } from 'src/app/core/models/reservation.interface';
import { loadReservationTypes } from 'src/app/state/actions/reservation-type.actions';
import {
  selectReservationTypeById,
  selectReservationTypeLoading,
  selectReservationTypes,
} from 'src/app/state/selectors/reservation-type.selectors';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  private router: Router = inject(Router);
  private store: Store = inject(Store);
  // reservationsTypes = signal<ReservationType[]>([]);
  reservationsTypes: ReservationType[] = [];
  isLoading$: Observable<any> = new Observable();
  skeletonItems = [
    {
      id: 1,
    },
    {
      id: 2,
    },

    {
      id: 3,
    },

    {
      id: 4,
    },

    {
      id: 5,
    },

    {
      id: 6,
    },
  ];
  constructor() {}

  ngOnInit() {
    this.store.dispatch(loadReservationTypes());
    this.isLoading$ = this.store.select(selectReservationTypeLoading);
  }

  ionViewWillEnter() {
    this.store.select(selectReservationTypes).subscribe((res) => {
      this.reservationsTypes = res;
    });
  }

  onCreateReservation(reservationId: any) {
    console.log('Reservation selected ', reservationId);
    this.router.navigate(['tabs/create-reservation', reservationId]);
  }

  handleRefresh(event: any) {
    this.store.dispatch(loadReservationTypes());
    setTimeout(() => event.target.complete(), 1500);
  }
}
