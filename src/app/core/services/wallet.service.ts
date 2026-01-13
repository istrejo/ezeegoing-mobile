import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from './api/api.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private apiService = inject(ApiService);
  constructor(private http: HttpClient) {}

  getPassFile(reservationId: number): Observable<Blob> {
    const url = `${this.apiService.baseUrl()}wallet/event-pass/reservation/${reservationId}/download/`;
    const headers = new HttpHeaders({ 'X-API-KEY': environment.apiSecretKey });

    return this.http.get(url, { headers, responseType: 'blob' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
