import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from '@formkit/tempo';
import { Store } from '@ngrx/store';
import { User } from 'src/app/core/models/auth.state.interface';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalComponent } from 'src/app/pages/visitors/components/modal/modal.component';
import { addReservation } from 'src/app/state/actions/reservation.actions';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { selectBuildingSelected } from 'src/app/state/selectors/building.selectors';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private modalSvc = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);
  public form!: FormGroup;
  private store = inject(Store);
  public user = signal<User | undefined>(undefined);
  public buildingId = signal<number | null>(null);
  public visitors: Visitor[] = [];

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
    console.log(this.form.value);
    this.loadData();
  }

  loadData() {
    this.store.select(selectUser).subscribe((user) => {
      console.log(user);
      this.user.set(user);
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId) => {
      console.log(buildingId);
      this.buildingId.set(buildingId);
    });
    this.store.select(selectVisitors).subscribe((visitors: Visitor[]) => {
      if (!visitors.length) {
        this.store.dispatch(loadVisitors());
      }
      console.log('Visitors: ', visitors);
      this.visitors = visitors.map((item: any) => {
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
      legal_id: ['', [Validators.required]],
      document_type: [1],
      phone: ['', [Validators.required]],
      building: [null],
      hasVehicle: [false],
      car_plate: [''],
    });
  }

  async addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      console.log('Modal data', data);
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      console.log(this.form.value);

      this.form.markAllAsTouched();
      return;
    }

    const {
      start_date,
      end_date,
      legal_id,
      phone,
      car_plate,
      visitorSelected,
      typeSelected,
      documentSelected,
      reservation_reference,
    } = this.form.value;

    let dto: any = {
      start_date,
      end_date,
      first_name: visitorSelected.first_name,
      last_name: visitorSelected.last_name,
      email: visitorSelected.email,
      created_by: this.user()?.userId,
      reservation_reference,
      reservation_type: typeSelected.id,
      legal_id,
      document_type: documentSelected.id,
      phone,
      building: this.buildingId(),
      company: '',
    };
    if (car_plate) {
      dto = {
        ...dto,
        car_plate: car_plate,
      };
    }
    console.log(dto);
    this.store.dispatch(addReservation({ dto }));
  }
}
