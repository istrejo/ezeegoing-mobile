import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  addVisitor,
  updateVisitor,
} from 'src/app/state/actions/visitor.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() visitor!: Visitor;
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
  visitorTypes = [
    {
      name: 'Permanente',
      value: true,
    },
    {
      name: 'Temporal',
      value: false,
    },
  ];

  constructor() {}

  ngOnInit() {
    this.initForm();
    if (!!this.visitor) {
      this.form.patchValue(this.visitor);
      if (this.visitor.is_permanent) {
        this.form.patchValue({
          visitor_type: this.visitorTypes[0],
        });
      }
      if (this.visitor.document_type === 1) {
        this.form.patchValue({
          document_selected: this.documentTypes[0],
        });
      } else {
        this.form.patchValue({
          document_selected: this.documentTypes[1],
        });
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      card_number: ['', [Validators.required]],
      company_name: ['', []],
      document_selected: [
        {
          name: 'Cédula',
          id: 1,
        },
      ],
      document_type: [1, [Validators.required]],
      legal_id: ['', [Validators.required]],
      is_supplier: [false, [Validators.required]],
      is_permanet: [true, [Validators.required]],
      visitor_type: [
        {
          name: 'Temporal',
          value: false,
        },
      ],
    });
  }

  close() {
    this.modalService.dismissModal();
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const {
        first_name,
        last_name,
        email,
        phone,
        card_number,
        document_selected,
        company_name,
        legal_id,
        is_supplier,
        visitor_type,
      } = this.form.value;

      if (is_supplier) {
        this.form.get('company_name')?.addValidators([Validators.required]);
      }

      const dto = {
        first_name,
        last_name,
        email,
        phone,
        card_number,
        company_name,
        document_type: document_selected.id,
        legal_id,
        is_supplier,
        is_permanent: visitor_type.value,
      };

      if (this.visitor) {
        this.store.dispatch(updateVisitor({ id: this.visitor.id, dto }));
        return;
      }

      this.store.dispatch(addVisitor({ dto }));
    }
  }
}
