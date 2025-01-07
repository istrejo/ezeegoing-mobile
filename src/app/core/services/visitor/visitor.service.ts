import { Visitor } from './../../models/visitor.state';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiSvc: ApiService = inject(ApiService);

  constructor() {}

  getVisitors(): Observable<Visitor[]> {
    return this.apiSvc.get<Visitor[]>('visitor/', { context: checkToken() });
  }
}
