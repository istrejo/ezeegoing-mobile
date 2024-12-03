import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth.state.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  login(username: string, password: string): Observable<any> {
    const loginData = { password, username, id: 2 };
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, loginData);
  }

  logout(): Observable<any> {
    const logoutData = {};
    return this.http.post(`${this.apiUrl}logout/`, logoutData);
  }
}
