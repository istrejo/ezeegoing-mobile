import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { selectBuildingSelected } from 'src/app/state/selectors/building.selectors';

@Component({
  selector: 'app-charger-form',
  templateUrl: './charger-form.page.html',
  styleUrls: ['./charger-form.page.scss'],
})
export class ChargerFormPage implements OnInit {
  private store = inject(Store);

  private fb = inject(FormBuilder);
  public form!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.store.select(selectUser).subscribe((user) => {
      console.log(user);
      this.form.patchValue({ badge: user?.badgeId });
    });
    this.store.select(selectBuildingSelected).subscribe((buildingId) => {
      console.log(buildingId);
      this.form.patchValue({ building: buildingId });
    });
    console.log(this.form.value);
  }

  onSubmit() {}

  initForm() {
    this.form = this.fb.group({
      badge: [null, [Validators.required]],
      building: [null, [Validators.required]],
      start_date: [new Date().toISOString(), [Validators.required]],
      end_date: [new Date().toISOString(), [Validators.required]],
      car_plate: ['', [Validators.required]],
      temp_plate: [false, [Validators.required]],
    });
  }
}
