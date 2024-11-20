import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth.state.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiSvc = inject(ApiService);

  constructor() {}

  login(username: string, password: string): Observable<any> {
    const loginData = { password, username, id: 2 };
    return this.apiSvc.post<LoginResponse>('login/', loginData);
  }

  logout(): Observable<any> {
    const logoutData = {};
    return this.apiSvc.post('logout', logoutData);
  }
}
