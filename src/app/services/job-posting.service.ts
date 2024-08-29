import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api/api-base.service';
import { JobPosting } from '../components/home/models/job-posting';

@Injectable({
  providedIn: 'root',
})
export class JobPostingService extends ApiBaseService {
  private readonly endpoint = 'job-postings';
  private readonly applicationEndpoint = 'applications';

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

  searchJobPostingsByTitle(keyword: string): Observable<JobPosting[]> {
    return this.get<JobPosting[]>(
      `${this.endpoint}/bytitle?keyword=${keyword}`
    );
  }

  searchJobPostingsBySalary(salary: number): Observable<any> {
    return this.get<any>(`${this.endpoint}/bysalary?salary=${salary}`);
  }

  searchJobPostingsByPostDate(postDate: string): Observable<any> {
    return this.get<any>(`${this.endpoint}/bypostdate?postDate=${postDate}`);
  }

  applyForAJob(jobPostingId: number): Observable<any> {
    return this.post<any>(
      `${this.applicationEndpoint}/apply/${jobPostingId}`,
      {}
    );
  }
}
