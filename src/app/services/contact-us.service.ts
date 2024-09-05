import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api/api-base.service';
import { ContactUsRequest } from '../components/contact-us/models/contact-us';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService extends ApiBaseService {
  private endpoint = 'contact-us';

  getContactDetails(id: string): Observable<any> {
    return this.get<any>(`${this.endpoint}/${id}`);
  }

  sendContactUsForm(data: ContactUsRequest): Observable<any> {
    return this.post<any>(this.endpoint, data);
  }
}
