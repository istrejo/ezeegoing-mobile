import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../models/auth.state.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenService = inject(TokenService);
  private http = inject(HttpClient);
  private store = inject(Store);
  private apiUrl = environment.apiUrl;
  public token = signal('');
  public refresh = signal('');

  constructor() {
    this.store.select(selectAuthState).subscribe((auth) => {
      this.token.set(auth.access_token || '');
      this.refresh.set(auth.refresh_token || '');
    });
  }

  login(username: string, password: string): Observable<any> {
    const loginData = { password, username, id: 2 };
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, loginData);
  }

  logout(): Observable<any> {
    const refresh_token = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}logout/`, {
      refresh_token,
    });
  }

  getAuthToken() {
    return localStorage.getItem('accessToken') || '';
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}token/refresh/`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
        })
      );
  }
}
