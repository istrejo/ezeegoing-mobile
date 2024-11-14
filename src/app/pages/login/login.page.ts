import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  router: Router = inject(Router);
  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.router.navigate(['/tabs/home']);
  }
}
