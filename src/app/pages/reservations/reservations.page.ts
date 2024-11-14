import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/core/models/reservation.interface';
import { loadReservations } from 'src/app/state/actions/reservation.actions';
import {
  selectLoading,
  selectReservations,
} from 'src/app/state/selectors/reservation.selectors';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  private store = inject(Store);
  public isLoading$: Observable<boolean> = new Observable();
  reservations: Observable<Reservation[]> = new Observable();
  constructor() {}

  ngOnInit(): void {}

  ionViewWillEnter() {
    this.store.select(selectReservations).subscribe((reservations) => {
      if (!reservations.length) {
        this.store.dispatch(loadReservations());
      }
    });
    this.reservations = this.store.select(selectReservations);
    this.isLoading$ = this.store.select(selectLoading);
  }

  handleRefresh(event: any) {
    this.store.dispatch(loadReservations());
    setTimeout(() => event.target.complete(), 1500);
  }
}
