import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth.state.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    console.log('Tokens: ', {
      token: this.token(),
      refresh: this.refresh(),
    });
    effect(() => {
      console.log('Toekn change:', this.token());
    });
  }

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
    return this.http.post('https://app.ezeeparking.com/api/token/refresh/', {
      refresh_token: this.refresh(),
    });
  }
}
