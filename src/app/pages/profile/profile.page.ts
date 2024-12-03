import {
  selectAuthState,
  selectUser,
} from './../../state/selectors/auth.selectors';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userInfo = null;
  private store = inject(Store);

  constructor() {}

  ngOnInit() {
    this.store.select(selectAuthState).subscribe((auth: any) => {
      console.log(auth);
      this.userInfo = auth;
    });
  }
}
