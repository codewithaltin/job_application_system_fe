import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api/api-base.service';
import { JobPosting } from '../components/home/models/job-posting';

@Injectable({
  providedIn: 'root',
})
export class JobPostingService extends ApiBaseService {
  private readonly endpoint = 'job-postings';

  getAllJobPostings(page: number = 0, size: number = 10): Observable<any> {
    return this.get<any>(`${this.endpoint}?page=${page}&size=${size}`);
  }

  getJobPostingById(id: number): Observable<JobPosting> {
    return this.get<JobPosting>(`${this.endpoint}/${id}`);
  }

  createJobPosting(jobPosting: JobPosting): Observable<JobPosting> {
    return this.post<JobPosting>(this.endpoint, jobPosting);
  }

  updateJobPosting(id: number, jobPosting: JobPosting): Observable<any> {
    return this.put<any>(`${this.endpoint}/${id}`, jobPosting);
  }

  deleteJobPosting(id: number): Observable<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
