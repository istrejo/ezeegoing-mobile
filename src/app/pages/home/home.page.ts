import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadReservationTypes } from 'src/app/state/actions/reservation-type.actions';
import { loadReservations } from 'src/app/state/actions/reservation.actions';
import { selectReservations } from 'src/app/state/selectors/reservation.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private store = inject(Store);
  public activeReservations: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.store.dispatch(loadReservations());
    this.store.dispatch(loadReservationTypes());
    this.store.select(selectReservations).subscribe((reservations) => {
      this.activeReservations = reservations.length;
    });
  }
}
