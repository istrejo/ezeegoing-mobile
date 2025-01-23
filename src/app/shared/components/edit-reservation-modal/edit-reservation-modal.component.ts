import { Visitor } from './../../../core/models/visitor.state';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
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
import { selectReservationTypes } from 'src/app/state/selectors/reservation-type.selectors';

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
  public form!: FormGroup;
  public faChevronLeft = faChevronLeft;
  public reservationType: number = 1;
  public type = '';
  public visitors = signal<Visitor[]>([]);
  public hasTypeCatalogs: boolean = false;
  public typeCatalogs = signal([]);

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
    const typeCatalogs = JSON.parse(
      localStorage.getItem('typeCatalogs') || '[]'
    ).map((item: any) => ({
      name: item.name,
      id: item.id,
    }));

    const typeCatalogSelected = typeCatalogs.find(
      (item: any) => item.id === this.reservation.reservation_type_catalog_id
    );

    this.hasTypeCatalogs = !!typeCatalogs.length;

    this.typeCatalogs.set(typeCatalogs);

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
    this.store.select(selectReservationTypes).subscribe((types) => {});

    console.log('resertvation: ', this.reservation);
    this.form.patchValue({
      visitorSelected: this.reservation.legal_id,
      start_date: dayjs(this.reservation.start_date).toISOString(),
      end_date: dayjs(this.reservation.end_date).toISOString(),
      create_by: this.reservation.created_by_id,
      email: this.reservation.email,
      building: this.reservation.building_id,
      reservation_type_catalog: typeCatalogSelected,
    });
  }

  ionViewWillLeave() {
    this.form.patchValue({});
  }

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      console.log('Modal data', data);
    });
  }

  initForm() {
    this.form = this.fb.group({
      visitorSelected: [null, [Validators.required]],
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
      building: [this.buildingId()],
      hasVehicle: [false],
      car_plate: [''],
      reservation_type_catalog: [{ name: 'Rancho 1', id: 1 }],
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
      reservation_reference,
      reservation_type_catalog,
      building,
    } = this.form.value;

    const createDto = (visitor: any) => ({
      start_date,
      end_date,
      first_name: visitor?.first_name,
      last_name: visitor?.last_name,
      email: visitor?.email,
      created_by: this.user()?.userId,
      reservation_reference,
      reservation_type: this.reservation.reservation_type_id,
      legal_id: visitor?.legal_id,
      document_type: visitor?.document_type,
      phone: visitor?.phone,
      building,
      company: '',
      ...(car_plate && { car_plate }),
      ...(reservation_type_catalog && {
        reservation_type_catalog: reservation_type_catalog.id,
      }),
    });

    if (this.reservationType == 2) {
      const dtoList: any[] = [];
      for (const legalId of visitorSelected) {
        const visitor = this.visitors().find(
          (item) => item.legal_id === legalId
        );
        if (visitor) {
          const dto = createDto(visitor);
          dtoList.push(dto);
        }
      }
      this.store.dispatch(
        updateReservation({
          dtoList: dtoList,
          reservationId: this.reservation.id,
          reservationType: this.reservation.reservation_type_id,
        })
      );
    } else {
      const visitor = this.visitors().find(
        (item) => item.legal_id === visitorSelected
      );
      if (visitor) {
        const dto = createDto(visitor);
        this.store.dispatch(
          updateReservation({ reservationId: this.reservation.id, dto })
        );
      }
    }
  }

  close() {
    this.modalSvc.dismissModal();
  }
}
