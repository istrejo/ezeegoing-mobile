import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';
import { HttpHeaders } from '@capacitor/core';

interface RequestOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private readonly API = environment.apiUrl;
  private baseUrl = signal<string | null>(null);
  private store = inject(Store);

  private http = inject(HttpClient);

  constructor() {
    this.store.select(selectAuthState).subscribe((auth) => {
      this.baseUrl.set(`https://${auth.userData?.base_url}/api/`);
    });
  }

  /**
   * GET request
   * @param {string} endPoint end point for the get by Id
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public getById<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl()}${endPoint}`, options);
  }

  /**
   * GET request
   * @param {string} endPoint end point for the get
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl()}${endPoint}`, options);
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {any} dto data to be sent in the body of the request
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public post<T>(
    endPoint: string,
    dto: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl()}${endPoint}`, dto, options);
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public put<T>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl()}${endPoint}`, body, options);
  }

  public patch<T>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl()}${endPoint}`, body, options);
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl()}${endPoint}`, options);
  }
}
