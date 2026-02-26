import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { format } from '@formkit/tempo';
import { Subject, takeUntil } from 'rxjs';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalComponent } from 'src/app/pages/visitors/components/modal/modal.component';
import { addReservation, addReservationSuccess } from 'src/app/state/actions/reservation.actions';
import { loadUser } from 'src/app/state/actions/user.actions';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import { selectUser } from 'src/app/state/selectors/user.selectors';
import { selectBuildingSelected } from 'src/app/state/selectors/building.selectors';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';
import { UserData } from 'src/app/core/models/user.state.intercafe';
import { AlertService } from 'src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  private alertSvc = inject(AlertService);
  private route = inject(ActivatedRoute);
  private modalSvc = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);
  private store = inject(Store);
  private actions = inject(Actions);
  private destroy$ = new Subject<void>();
  public form!: FormGroup;
  public user = signal<UserData | null>(null);
  public buildingId = signal<number | null>(null);
  public visitors = signal<Visitor[]>([]);
  reservationType: number = 0;
  reservationName: string = '';
  hasTypeCatalogs: boolean = false;

  typeCatalogs = signal([]);

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
    console.log('Enter');
    const typeCatalogs = JSON.parse(
      localStorage.getItem('typeCatalogs') || '[]'
    );

    this.hasTypeCatalogs = !!typeCatalogs.length;

    this.typeCatalogs.set(typeCatalogs);
    this.route.params.subscribe(({ name, id }) => {
      console.log({ name, id });
      this.reservationType = Number(id);
      this.reservationName = name;
    });
    console.log(this.reservationType);
    this.loadData();

    if (this.reservationType > 2) {
      this.form.get('visitorSelected')?.setValidators([]);
    }

    this.actions
      .pipe(
        ofType(addReservationSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.resetForm());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {
    this.form.reset();
  }

  loadData() {
    this.store.select(selectUser).subscribe((user) => {
      if (!user) {
        this.store.dispatch(loadUser());
      }
      this.user.set(user);
      console.log(this.user());
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId) => {
      this.buildingId.set(buildingId);
    });
    this.store.select(selectVisitors).subscribe((visitors: Visitor[]) => {
      if (!visitors.length) {
        this.store.dispatch(loadVisitors());
      }
      this.visitors.set(visitors);
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
      created_by: [this.user()?.user.id],
      reservation_reference: [new Date().getTime().toString().slice(0, 9)],
      building: [this.buildingId()],
      hasVehicle: [false],
      car_plate: [''],
      reservation_type_catalog: [null],
    });
  }

  resetForm() {
    this.form.reset({
      visitorSelected: null,
      start_date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
      end_date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
      first_name: '',
      last_name: '',
      created_by: this.user()?.user.id,
      reservation_reference: new Date().getTime().toString().slice(0, 9),
      building: this.buildingId(),
      hasVehicle: false,
      car_plate: '',
      reservation_type_catalog: null,
    });
    this.form.markAsUntouched();
  }

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {});
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
    } = this.form.value;

    if (new Date(start_date) >= new Date(end_date)) {
      console.error('La fecha de inicio debe ser menor que la fecha de fin');
      this.alertSvc.presentAlert({
        message:
          'La fecha de finalización no puede ser menor o igual a la de inicio',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });

      return;
    }

    const createDto = (visitor?: any) => ({
      start_date,
      end_date,
      first_name:
        this.reservationType > 2
          ? this.user()?.user.first_name
          : visitor?.first_name,
      last_name:
        this.reservationType > 2
          ? this.user()?.user.last_name
          : visitor?.last_name,
      email:
        this.reservationType > 2 ? this.user()?.user.email : visitor?.email,
      created_by: this.user()?.user.id,
      reservation_reference,
      reservation_type: this.reservationType,
      legal_id:
        this.reservationType > 2 ? this.user()?.legal_id : visitor?.legal_id,
      document_type:
        this.reservationType > 2
          ? this.user()?.document_type.id
          : visitor?.document_type,
      phone: this.reservationType > 2 ? this.user()?.phone : visitor?.phone,
      building: this.buildingId(),
      company: '',
      ...(car_plate && { car_plate }),
      ...(reservation_type_catalog && {
        reservation_type_catalog: reservation_type_catalog.id,
      }),
    });

    console.log('Dto to send: ', createDto());

    if (this.reservationType === 2) {
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
        addReservation({ dtoList: dtoList, reservationType: 2 })
      );
    } else {
      const visitor = this.visitors().find(
        (item) => item.legal_id === visitorSelected
      );
      const dto = createDto(visitor);
      this.store.dispatch(addReservation({ dto }));
    }
  }
}
