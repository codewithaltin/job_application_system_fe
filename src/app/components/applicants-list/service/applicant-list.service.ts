import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../services/api/api-base.service';
import { Observable } from 'rxjs';
import { Applicant } from '../models/applicant';

@Injectable({
  providedIn: 'root',
})
export class ApplicantListService extends ApiBaseService {
  private endpoint = 'applicants';

  getApplicants(): Observable<Applicant[]> {
    return this.get<Applicant[]>(this.endpoint);
  }

  addApplicant(applicant: Applicant): Observable<Applicant> {
    return this.post<Applicant>(this.endpoint, applicant);
  }

  updateApplicant(applicant: Applicant): Observable<Applicant> {
    return this.put<Applicant>(`${this.endpoint}/${applicant.id}`, applicant);
  }

  deleteApplicant(applicantId: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${applicantId}`);
  }
}
