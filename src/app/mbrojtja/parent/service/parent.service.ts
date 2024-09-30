import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../services/api/api-base.service';
import { Parent } from '../model/parent-model';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  private apiService = inject(ApiBaseService);
  private endpoint = 'parents';

  getAll(): Observable<Parent[]> {
    return this.apiService.get<Parent[]>(this.endpoint);
  }

  create(parentData: Parent): Observable<Parent> {
    return this.apiService.post<Parent>(this.endpoint, parentData);
  }

  update(id: number, parentData: Parent): Observable<Parent> {
    return this.apiService.put<Parent>(`${this.endpoint}/${id}`, parentData);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  softDelete(id: number): Observable<void> {
    return this.apiService.put<void>(`${this.endpoint}/soft-delete/${id}`, {});
  }
}
