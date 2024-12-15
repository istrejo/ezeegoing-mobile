import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/core/models/reservation.interface';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  updateAccessToken,
  updateRefreshToken,
} from 'src/app/state/actions/auth.actions';
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
  private authservice = inject(AuthService);
  reservations: Observable<Reservation[]> = new Observable();
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
    // this.authservice.refreshToken().subscribe((res) => {
    //   console.log('Refresh response: ', res);
    //   this.store.dispatch(
    //     updateAccessToken({ access_token: res.access_token })
    //   );
    //   this.store.dispatch(
    //     updateRefreshToken({ refresh_token: res.refresh_token })
    //   );
    // });
    setTimeout(() => event.target.complete(), 1500);
  }
}
