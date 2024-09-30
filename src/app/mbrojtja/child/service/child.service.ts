import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../services/api/api-base.service';
import { Child } from '../model/child-model';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private apiService = inject(ApiBaseService);
  private endpoint = 'children';

  getAll(): Observable<Child[]> {
    return this.apiService.get<Child[]>(this.endpoint);
  }

  create(childData: Child): Observable<Child> {
    return this.apiService.post<Child>(this.endpoint, childData);
  }

  update(id: number, data: Child): Observable<Child> {
    return this.apiService.put<Child>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  softDelete(id: number): Observable<void> {
    return this.apiService.put<void>(`${this.endpoint}/soft-delete/${id}`, {});
  }
}
