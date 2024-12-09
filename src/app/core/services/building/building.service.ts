import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiService: ApiService = inject(ApiService);

  constructor() {}

  getBuildings(): Observable<any> {
    return this.apiService.get('building/');
  }
}
