import { inject, Injectable } from '@angular/core';
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
    const refresh_token = localStorage.getItem('refreshToken');
    return this.http.post(`https://app.ezeeparking.com/api/logout/`, {
      refresh_token,
    });
  }

  getAuthToken() {
    return localStorage.getItem('accessToken') || '';
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}token/refresh/`, {
      refresh_token: refreshToken,
    });
  }
}
