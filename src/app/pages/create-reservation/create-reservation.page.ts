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
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalComponent } from '../visitors/components/modal/modal.component';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage implements OnInit {
  private modalSvc = inject(ModalService);
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
  buildingId = signal<number | null>(null);

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
    this.store.select(selectUser).subscribe((user) => {
      console.log(user);
      this.user.set(user);
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId) => {
      console.log(buildingId);
      this.buildingId.set(buildingId);
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

  ionViewWillLeave() {
    this.form.reset();
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
      email: ['', [Validators.required, Validators.email]],
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

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent);
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
      email,
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
      email,
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
