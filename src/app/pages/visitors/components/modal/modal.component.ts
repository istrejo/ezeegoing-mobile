import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  private modalService = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);
  public form!: FormGroup;
  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({});
  }

  close() {
    this.modalService.dismissModal();
  }
  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
