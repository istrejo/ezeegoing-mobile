import { LocalStorageService } from './../../core/services/localstorage/localstorage.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private store: Store = inject(Store);
  private localStorageSvc = inject(LocalStorageService);
  fb: FormBuilder = inject(FormBuilder);
  form!: FormGroup;
  credentials: any = null;
  constructor() {}

  ngOnInit() {
    this.initForm();
    this.credentials = JSON.parse(this.localStorageSvc.getItem('credentials'));
    if (this.credentials) {
      this.form.patchValue(this.credentials);
    }
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  saveCredentials() {
    const credentials = this.form.value;
    if (credentials.rememberMe) {
      this.localStorageSvc.setItem('credentials', JSON.stringify(credentials));
      return;
    }
    this.localStorageSvc.removeItem('credentials');
  }

  onSubmit() {
    this.saveCredentials();
    const { password, username } = this.form.value;
    this.store.dispatch(login({ username, password }));
  }
}
