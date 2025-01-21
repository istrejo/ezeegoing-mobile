import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { User } from 'src/app/core/models/auth.state.interface';

import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage implements OnInit {
  private route = inject(ActivatedRoute);
  public user = signal<User | undefined>(undefined);
  public buildingSelected = signal<number | null>(null);
  form!: FormGroup;
  faChevronLeft = faChevronLeft;
  title: string = '';
  reservationType: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe(({ name, id }) => {
      this.title = name;
      this.reservationType = id;
    });
  }
}
