import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JobPostingService } from '../../services/job-posting.service';
import { JobPosting } from './models/job-posting';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DatePipe } from '@angular/common';
import { JobCategory } from '../../enums/enums';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  jobPostings: JobPosting[] = [];
  isLoading = false;
  hasMore = true;
  noJobsFound = false;

  form!: FormGroup;

  private page = 0;
  private readonly size = 5;
  private loggedInUserId: string | null = null;

  categories = Object.values(JobCategory);
  salaryOptions = [1000, 3000, 5000, 8000, 10000];

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loggedInUserId = this.authService.getUserIdFromToken();
    this.loadJobPostings();
    this.subscribeToFilterChanges();
  }

  initForm(): void {
    this.form = this.fb.group({
      keyword: [''],
      selectedSalary: [null],
      postDate: [null],
      selectedCategory: [null],
    });
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

  searchJobPostings(): void {
    const { keyword, selectedSalary, postDate, selectedCategory } =
      this.form.value;

    const formattedDate = postDate
      ? this.datePipe.transform(postDate, 'dd/MM/yyyy')
      : null;

    this.jobPostingService
      .searchJobPostingsByFilters({
        title: keyword,
        salary: selectedSalary || undefined,
        postDate: formattedDate || undefined,
        category: selectedCategory || undefined,
      })
      .subscribe({
        next: (response) => this.handleSearchResponse(response),
        error: (error) => this.handleSearchError(error),
      });
  }

  private subscribeToFilterChanges(): void {
    this.form
      .get('selectedSalary')!
      .valueChanges.subscribe(() =>
        setTimeout(() => this.searchJobPostings(), 0)
      );
    this.form
      .get('postDate')!
      .valueChanges.subscribe(() =>
        setTimeout(() => this.searchJobPostings(), 0)
      );
    this.form
      .get('selectedCategory')!
      .valueChanges.subscribe(() =>
        setTimeout(() => this.searchJobPostings(), 0)
      );
  }

  private handleSearchResponse(response: JobPosting[]): void {
    this.jobPostings = response;
    this.noJobsFound = this.jobPostings.length === 0;
    this.hasMore = this.jobPostings.length > 0;
  }

  private handleSearchError(error: any): void {
    console.error('Error searching job postings:', error);
    this.notificationService.show('Error searching job postings');
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  private handleSuccessfulLoad(response: any): void {
    this.jobPostings = [...this.jobPostings, ...response.content];
    this.hasMore = response.pageable.pageNumber < response.totalPages - 1;
    this.setLoadingState(false);
    this.page++;
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
