import { Visitor } from './../../../core/models/visitor.state';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { User } from 'src/app/core/models/auth.state.interface';
import { Reservation } from 'src/app/core/models/reservation.interface';
import { updateReservation } from 'src/app/state/actions/reservation.actions';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { selectBuildingSelected } from 'src/app/state/selectors/building.selectors';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';

import { format } from '@formkit/tempo';

@Component({
  selector: 'app-edit-reservation-modal',
  templateUrl: './edit-reservation-modal.component.html',
  styleUrls: ['./edit-reservation-modal.component.scss'],
})
export class EditReservationModalComponent implements OnInit {
  @Input() reservation!: Reservation;
  private modalCtrl = inject(ModalController);
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
    console.log(this.reservation);

    this.form.patchValue({
      start_date: this.reservation.start_date,
      end_date: this.reservation.end_date,
      visitorSelected: {
        name: this.reservation.first_name + ' ' + this.reservation.last_name,
        id: this.reservation.badge_id,
      },
      create_by: this.reservation.created_by_id,
      email: this.reservation.email,
      legal_id: this.reservation.legal_id,
      phone: this.reservation.phone,
      building: this.reservation.building_id,
    });

    this.store.select(selectUser).subscribe((user: any) => {
      // console.log(user);
      this.user.set(user);
      this.form.patchValue({ created_by: user?.userId });
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId: any) => {
      // console.log(buildingId);
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

    console.log(this.form.value);
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
      // start_date: ['2024-12-27 00:43:39', Validators.required],

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
    const documentSelected = this.form.controls['documentSelected']?.value.id;
    const typeSelected = this.form.controls['typeSelected']?.value.id;
    const firstName = this.form.controls['visitorSelected']?.value.first_name;
    const lastName = this.form.controls['visitorSelected']?.value.last_name;
    this.form.patchValue({
      first_name: firstName,
      last_name: lastName,
      document_type: documentSelected,
      reservation_type: typeSelected,
    });
    const {
      start_date,
      end_date,
      first_name,
      last_name,
      email,
      created_by,
      reservation_reference,
      reservation_type,
      legal_id,
      document_type,
      phone,
      building,
      car_plate,
    } = this.form.value;

    let dto: any = {
      start_date,
      end_date,
      first_name,
      last_name,
      email,
      created_by,
      reservation_reference,
      reservation_type,
      legal_id,
      document_type,
      phone,
      building,
    };
    if (car_plate.length > 1) {
      dto = {
        ...dto,
        car_plate: car_plate,
      };
    }

    // TODO: usar el dispath y crear el metodo edit en el effect
    this.store.dispatch(
      updateReservation({ reservationId: this.reservation.id, dto })
    );
    // this.form.reset();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
