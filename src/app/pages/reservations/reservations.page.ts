import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  reservations = signal<Reservation[]>([]);
  reservationsTemp = signal<Reservation[]>([]);
  public search = '';
  limit = 10;
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
    this.store.select(selectReservations).subscribe((reservations) => {
      this.reservations.set(reservations);
      this.reservationsTemp.set(reservations.slice(0, this.limit));
    });
    this.isLoading$ = this.store.select(selectLoading);
  }

  handleRefresh(event: any) {
    this.store.dispatch(loadReservations());
    setTimeout(() => event.target.complete(), 1500);
    console.log(this.reservations());
    this.store.select(selectReservations).subscribe((reservations) => {
      if (!reservations.length) {
        this.store.dispatch(loadReservations());
      }
    });
    this.store.select(selectReservations).subscribe((reservations) => {
      this.reservations.set(reservations);
      this.reservationsTemp.set(reservations.slice(0, this.limit));
    });
    this.isLoading$ = this.store.select(selectLoading);
  }

  onSearch() {}

  orderSearch() {
    const search = this.search.toLowerCase();
    this.limit = 10;

    if (!search.trim()) {
      this.reservationsTemp.set(this.reservations().slice(0, this.limit));
      return;
    }

    this.reservationsTemp.update((prev) =>
      this.reservations()
        .filter((item: Reservation) =>
          item.fullname?.toLowerCase().includes(search)
        )
        .slice(0, this.limit)
    );
  }

  onScroll(event: any): void {
    const search = this.search.toLocaleLowerCase();
    if (search.trim()) {
      this.limit += 10;
      this.reservationsTemp.set(
        this.reservations()
          .filter((data: Reservation): any => data.fullname?.includes(search))
          .slice(0, this.limit)
      );
    } else if (this.limit < this.reservations().length) {
      this.limit += 10;
      this.reservationsTemp.set(this.reservations().slice(0, this.limit));
    }
    event.target.complete();
  }

  onReserve() {
    this.router.navigate(['/tabs/reserve']);
  }
}
