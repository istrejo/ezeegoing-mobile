import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReservationType } from 'src/app/core/models/reservation.interface';
import { loadReservationTypes } from 'src/app/state/actions/reservation-type.actions';
import {
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

  /**
   * The `ngOnInit` function dispatches an action to load reservation types and selects the loading state
   * from the store.
   */
  ngOnInit() {
    this.store.dispatch(loadReservationTypes());
    this.isLoading$ = this.store.select(selectReservationTypeLoading);
  }

  /**
   * The ionViewWillEnter function in TypeScript subscribes to a store selector for reservation types and
   * assigns the result to a variable.
   */
  ionViewWillEnter() {
    this.store.select(selectReservationTypes).subscribe((res) => {
      this.reservationsTypes = res;
    });
  }

  /**
   * The onCreateReservation function logs the selected reservation ID and navigates to the
   * create-reservation page with the reservation ID.
   * @param {any} reservationId - The `reservationId` parameter in the `onCreateReservation` function is
   * used to identify the specific reservation that has been selected. It is then passed to the
   * `router.navigate` method to navigate to the `create-reservation` route with the selected
   * `reservationId`.
   */
  onCreateReservation(reservationId: any) {
    this.router.navigate(['tabs/create-reservation', reservationId]);
  }

  /**
   * The `handleRefresh` function dispatches an action to load reservation types and completes a refresh
   * event after a delay of 1500 milliseconds.
   * @param {any} event - The `event` parameter in the `handleRefresh` function is typically an event
   * object that is passed when a user triggers a refresh action, such as pulling down on a list to
   * refresh its content. This event object contains information about the event that occurred, such as
   * the target element that triggered the event
   */
  handleRefresh(event: any) {
    this.store.dispatch(loadReservationTypes());
    setTimeout(() => event.target.complete(), 1500);
  }
}
