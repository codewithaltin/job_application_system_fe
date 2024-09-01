import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api/api-base.service';
import { JobPosting } from '../components/home/models/job-posting';
import { JobCategory } from '../enums/enums';
import { HttpParams } from '@angular/common/http';

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

  searchJobPostingsByFilters(filters: {
    title?: string;
    salary?: number;
    postDate?: string;
    category?: JobCategory;
  }): Observable<JobPosting[]> {
    let params = new HttpParams();

    if (filters.title) {
      params = params.set('title', filters.title);
    }
    if (filters.salary != null) {
      params = params.set('salary', filters.salary.toString());
    }
    if (filters.postDate) {
      params = params.set('postDate', filters.postDate);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }

    return this.get<JobPosting[]>(`${this.endpoint}/search`, { params });
  }

  applyForAJob(jobPostingId: number): Observable<any> {
    return this.post<any>(
      `${this.applicationEndpoint}/apply/${jobPostingId}`,
      {}
    );
  }
}
