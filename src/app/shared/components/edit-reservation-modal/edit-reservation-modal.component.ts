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
import * as dayjs from 'dayjs';

import { format } from '@formkit/tempo';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalComponent } from 'src/app/pages/visitors/components/modal/modal.component';

@Component({
  selector: 'app-edit-reservation-modal',
  templateUrl: './edit-reservation-modal.component.html',
  styleUrls: ['./edit-reservation-modal.component.scss'],
})
export class EditReservationModalComponent implements OnInit {
  @Input() reservation!: Reservation;
  private modalSvc = inject(ModalService);
  private store = inject(Store);
  private fb: FormBuilder = inject(FormBuilder);
  public user = signal<User | undefined>(undefined);
  public buildingId = signal<number | null>(null);
  form!: FormGroup;
  faChevronLeft = faChevronLeft;
  reservationType: number = 1;
  type = '';
  visitors = signal<Visitor[]>([]);

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
    this.store.select(selectUser).subscribe((user: any) => {
      this.user.set(user);
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId: any) => {
      this.buildingId.set(buildingId);
    });
    this.store.select(selectVisitors).subscribe((res: Visitor[]) => {
      if (!res.length) {
        this.store.dispatch(loadVisitors());
      }
      this.visitors.set(res);
    });

    console.log('resertvation: ', this.reservation);
    this.form.patchValue({
      visitorSelected: this.reservation.legal_id,
      start_date: dayjs(this.reservation.start_date).toISOString(),
      end_date: dayjs(this.reservation.end_date).toISOString(),
      typeSelected: {
        name:
          this.reservation.reservation_type_id === 1 ? 'Normal' : 'Temporal',
        id: this.reservation.reservation_type_id,
      },
      documentSelected: {
        name: this.reservation.document_type_id === 1 ? 'Cédula' : 'Pasaporte',
        id: this.reservation.document_type_id,
      },
      document_type: this.reservation.document_type_id,
      reservation_type: this.reservation.document_type_id,
      create_by: this.reservation.created_by_id,
      email: this.reservation.email,
      legal_id: this.reservation.legal_id,
      phone: this.reservation.phone,
      building: this.reservation.building_id,
    });
  }

  ionViewWillLeave() {
    this.form.reset();
  }

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      console.log('Modal data', data);
    });
  }

  initForm() {
    this.form = this.fb.group({
      visitorSelected: [null, [Validators.required]],
      documentSelected: [null, [Validators.required]],
      typeSelected: [null, [Validators.required]],
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
      created_by: [this.user()?.userId],
      reservation_reference: [new Date().getTime().toString().slice(0, 9)],
      reservation_type: [0],
      legal_id: ['', []],
      document_type: [null],
      phone: ['', []],
      building: [this.buildingId()],
      hasVehicle: [false],
      car_plate: [''],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      start_date,
      end_date,
      car_plate,
      visitorSelected,
      typeSelected,
      reservation_reference,
    } = this.form.value;
    const visitor: Visitor | undefined = this.visitors().find(
      (item) => item.legal_id == visitorSelected
    );

    if (!visitor) {
      console.error('Visitor not found');
      return;
    }

    let dto: any = {
      start_date,
      end_date,
      first_name: visitor.first_name,
      last_name: visitor.last_name,
      email: visitor.email,
      created_by: this.user()?.userId,
      reservation_reference,
      reservation_type: typeSelected.id,
      legal_id: this.reservation.legal_id,
      document_type: visitor.document_type,
      phone: visitor.phone,
      building: this.buildingId(),
      company: '',
    };

    if (car_plate) {
      dto = {
        ...dto,
        car_plate: car_plate,
      };
    }

    this.store.dispatch(
      updateReservation({ reservationId: this.reservation.id, dto })
    );
  }

  close() {
    this.modalSvc.dismissModal();
  }
}
