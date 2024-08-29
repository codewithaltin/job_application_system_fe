import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JobPostingService } from '../../services/job-posting.service';
import { JobPosting } from './models/job-posting';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  jobPostings: any[] = [];
  isLoading = false;
  hasMore = true;
  private page = 0;
  private size = 5;

  constructor(private jobPostingService: JobPostingService) {}

  ngOnInit(): void {
    this.loadJobPostings();
  }

  loadJobPostings(): void {
    this.isLoading = true;
    this.jobPostingService.getAllJobPostings(this.page, this.size).subscribe({
      next: (response) => {
        this.jobPostings = [...this.jobPostings, ...response.content];
        this.hasMore = response.pageable.pageNumber < response.totalPages - 1;
        this.isLoading = false;
        this.page++;
      },
      error: () => {
        this.isLoading = false;
        this.hasMore = false;
      },
    });
  }

  loadMore(): void {
    if (this.hasMore) {
      this.loadJobPostings();
    }
  }
}
