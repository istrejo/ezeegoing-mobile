import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';
import { Visitor } from 'src/app/core/models/visitor.state';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import { User } from 'src/app/core/models/auth.state.interface';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { selectBuildingSelected } from 'src/app/state/selectors/building.selectors';
import { addReservation } from 'src/app/state/actions/reservation.actions';
import { format } from '@formkit/tempo';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage implements OnInit {
  private store = inject(Store);
  private fb: FormBuilder = inject(FormBuilder);
  public user = signal<User | undefined>(undefined);
  public buildingSelected = signal<number | null>(null);
  form!: FormGroup;
  faChevronLeft = faChevronLeft;
  title = 'Visitante';
  reservationType: number = 1;
  type = '';
  visitors: Visitor[] = [];

  documentTypes = [
    {
      name: 'Cédula',
      id: 1,
    },
    {
      name: 'Pasaporte',
      id: 2,
    },
  ];

  reservationTypes = [
    {
      name: 'Normal',
      id: 1,
    },
    {
      name: 'Temporal',
      id: 2,
    },
  ];

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.form.reset();
    this.store.select(selectUser).subscribe((user) => {
      console.log(user);
      this.user.set(user);
      this.form.patchValue({ created_by: user?.userId });
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId) => {
      console.log(buildingId);
      this.form.patchValue({ building: buildingId });
    });
    this.store.select(selectVisitors).subscribe((res: Visitor[]) => {
      if (!res.length) {
        this.store.dispatch(loadVisitors());
      }
      this.visitors = res.map((item: any) => {
        return {
          ...item,
          name: item.first_name + ' ' + item.last_name,
          id: item.badge,
        };
      });
    });
  }

  initForm() {
    this.form = this.fb.group({
      visitorSelected: new FormControl<Visitor | null>(null),
      documentSelected: new FormControl<any>(null),
      typeSelected: new FormControl<any>(null),
      start_date: [
        format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
        Validators.required,
      ],
      end_date: [
        format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
        Validators.required,
      ],
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      created_by: [this.user()?.userId],
      reservation_reference: [new Date().getTime().toString().slice(0, 9)],
      reservation_type: new FormControl<number>(0),
      legal_id: ['', [Validators.required]],
      document_type: [1, [Validators.required]],
      phone: ['', [Validators.required]],
      building: [null],
      hasVehicle: [false],
      car_plate: [''],
    });
  }

  onSubmit() {
    const {
      start_date,
      end_date,
      email,
      created_by,
      reservation_reference,
      legal_id,
      phone,
      building,
      car_plate,
      visitorSelected,
      typeSelected,
      documentSelected,
    } = this.form.value;

    let dto: any = {
      start_date,
      end_date,
      first_name: visitorSelected.first_name,

      last_name: visitorSelected.last_name,
      email,
      created_by,
      reservation_reference,
      reservation_type: typeSelected.id,
      legal_id,
      document_type: documentSelected.id,
      phone,
      building,
    };
    if (car_plate.length > 1) {
      dto = {
        ...dto,
        car_plate: car_plate,
      };
    }

    this.store.dispatch(addReservation({ dto }));
  }
}
