import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

interface Visitor {
  name: string;
  id: string;
}

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private reservationSvc = inject(ReservationService);
  private loadingSvc = inject(LoadingService);
  private modalCtrl: ModalController = inject(ModalController);
  form!: FormGroup;
  faChevronLeft = faChevronLeft;
  title = 'Visitante';
  reservationType: number = 1;
  type = '';
  visitors: any[] = [];
  buildings: any[] = [];
  vehicles: any[] = [];

  testControl = new FormControl('My default value');

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.visitors = [
      { name: 'Nombre visitante #1', id: 'NY' },
      { name: 'Nombre visitante #2', id: 'RM' },
      { name: 'Nombre visitante #3', id: 'LDN' },
      { name: 'Nombre visitante #4', id: 'IST' },
      { name: 'Nombre visitante #5', id: 'PRS' },
    ];
    this.vehicles = [
      { name: 'Sedan', id: 1 },
      { name: 'SUV', id: 2 },
      { name: 'Crossover', id: 3 },
      { name: 'Minivan', id: 4 },
      { name: 'Moto', id: 5 },
    ];

    this.buildings = [
      {
        id: 1,
        title: 'Edif. Veronica',
      },
      {
        id: 2,
        title: 'Edif. Guzman',
      },
      {
        id: 3,
        title: 'Edif. Blue',
      },
      {
        id: 4,
        title: 'Edif. Red hat ubuntu pro',
      },
      {
        id: 5,
        title: 'Edif. Washintong',
      },
    ];
  }

  initForm() {
    this.form = this.fb.group({
      department: ['', []],
      division: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      firstName: new FormControl<Visitor | null>({
        name: 'alfredo',
        id: '3423423',
      }),
      lastName: ['', Validators.required],
      createdBy: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      reservationType: ['', Validators.required],
      legalId: ['', Validators.required],
      codumentType: ['', Validators.required],
      phone: ['', Validators.required],
      building: ['', Validators.required],
      hasVehicle: [false],
      vehicle_type: [''],
    });
  }

  onSubmit() {
    this.loadingSvc.present();
    const dto = {
      start_date: '2024-10-31 00:00:00',
      end_date: '2024-10-31 01:00:00',
      first_name: 'Alfonso',
      last_name: 'Guzman',
      email: 'istrejo2106@gmail.com',
      created_by: 2,
      reservation_reference: '3AE95081C5',
      reservation_type: 2,
      legal_id: '11640738',
      document_type: 1,
      phone: '83203913',
      building: 1,
    };
    this.reservationSvc.createReservation(dto).subscribe(
      (res) => {
        console.log('Create reserve: ', res);
        this.loadingSvc.dismiss();
        this.openModal();
      },
      (error) => {
        this.loadingSvc.dismiss();
        this.openModal();
        console.log(error);
      }
    );
  }

  /**
   * The openModal function creates and presents a modal component asynchronously.
   */
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SuccessModalComponent,
    });
    await modal.present();
  }
}
