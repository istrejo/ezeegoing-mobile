import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { addVisitor } from 'src/app/state/actions/visitor.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);
  public form!: FormGroup;

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

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      card_number: ['', [Validators.required]],
      company_name: ['', []],
      document_selected: new FormControl<any>(null),
      document_type: [0, [Validators.required]],
      legal_id: ['', [Validators.required]],
      is_supplier: [false, [Validators.required]],
    });
  }

  close() {
    this.modalService.dismissModal();
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const { document_selected } = this.form.value;
    this.form.patchValue({
      document_type: document_selected.id,
    });
    const {
      first_name,
      last_name,
      email,
      phone,
      card_number,
      company_name,
      document_type,
      legal_id,
      is_supplier,
    } = this.form.value;

    if (is_supplier) {
      this.form.get('card_number')?.addValidators([Validators.required]);
    }

    const dto = {
      first_name,
      last_name,
      email,
      phone,
      card_number,
      company_name,
      document_type,
      legal_id,
      is_supplier,
    };

    this.store.dispatch(addVisitor({ dto: dto }));
  }
}
