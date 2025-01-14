import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { User } from 'src/app/core/models/auth.state.interface';

import { ModalService } from 'src/app/core/services/modal/modal.service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage {
  public user = signal<User | undefined>(undefined);
  public buildingSelected = signal<number | null>(null);
  form!: FormGroup;
  faChevronLeft = faChevronLeft;
  title = 'Visitante';

  constructor() {}
}
