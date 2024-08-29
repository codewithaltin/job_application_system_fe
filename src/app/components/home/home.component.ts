import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JobPostingService } from '../../services/job-posting.service';
import { JobPosting } from './models/job-posting';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service'; // Import NotificationService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  jobPostings: JobPosting[] = [];
  isLoading = false;
  hasMore = true;
  noJobsFound = false;
  private page = 0;
  private readonly size = 5;
  loggedInUserId: string | null = null;

  constructor(
    private jobPostingService: JobPostingService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserIdFromToken();
    this.loadJobPostings();
  }

  loadJobPostings(): void {
    this.setLoadingState(true);
    this.jobPostingService.getAllJobPostings(this.page, this.size).subscribe({
      next: (response) => this.handleSuccessfulLoad(response),
      error: () => this.handleErrorLoad(),
    });
  }

  loadMore(): void {
    if (this.hasMore) {
      this.loadJobPostings();
    }
  }

  applyForJob(jobPostingId: number): void {
    this.jobPostingService.applyForAJob(jobPostingId).subscribe({
      next: () => this.handleSuccessfulApplication(),
      error: (error) => this.handleFailedApplication(error),
    });
  }

  hasApplied(jobPosting: JobPosting): boolean {
    return jobPosting.applications.some(
      (application: any) => application.applicantId === this.loggedInUserId
    );
  }

  searchJobPostings(keyword: string): void {
    this.jobPostingService.searchJobPostingsByTitle(keyword).subscribe({
      next: (response) => {
        this.jobPostings = response;
        this.noJobsFound = this.jobPostings.length === 0;
      },
      error: (error) => {
        console.error('Error searching job postings:', error);
        this.notificationService.show('Error searching job postings');
      },
    });
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  private handleSuccessfulLoad(response: any): void {
    this.jobPostings = [...this.jobPostings, ...response.content];
    this.hasMore = response.pageable.pageNumber < response.totalPages - 1;
    this.setLoadingState(false);
  }

  private handleErrorLoad(): void {
    this.setLoadingState(false);
    this.hasMore = false;
    this.notificationService.show(
      'Failed to load job postings. Please try again later.'
    );
  }

  private handleSuccessfulApplication(): void {
    this.notificationService.show(
      'You have successfully applied for this job!'
    );
    this.reloadJobPostings();
  }

  private handleFailedApplication(error: any): void {
    console.error('Application failed', error);
    this.notificationService.show(
      'There was an issue applying for this job. Please try again.'
    );
  }

  private reloadJobPostings(): void {
    this.page = 0;
    this.jobPostings = [];
    this.loadJobPostings();
  }
}
