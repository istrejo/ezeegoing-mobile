import { Visitor } from './../../models/visitor.state';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiSvc: ApiService = inject(ApiService);

  constructor() {}

  getVisitors(): Observable<Visitor[]> {
    return this.apiSvc
      .get<Visitor[]>('visitor/', { context: checkToken() })
      .pipe(
        map((visitors) =>
          visitors.map((item) => ({
            ...item,
            fullname: `${item.first_name} ${item.last_name}`,
          }))
        )
      );
  }

  createVisitor(dto: any) {
    return this.apiSvc.post('visitor/', dto, {
      context: checkToken(),
    });
  }

  deleteVisitor(id: number) {
    return this.apiSvc.delete(`visitor/${id}/`, {
      context: checkToken(),
    });
  }

  updateVisitor(id: string, dto: any) {
    return this.apiSvc.put(`visitor/${id}/`, dto, {
      context: checkToken(),
    });
  }
}
