import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/api/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileTemplateComponent } from '../profile-header/profile-header.component';
import { AddJobPostingDialogComponent } from '../job-posting/add-job-posting-dialog.component';
import { JobPostingService } from '../../services/job-posting.service';
@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [SharedModule, ProfileTemplateComponent],
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.scss'],
})
export class EmployerProfileComponent {
  profileData: any = null;
  userRole: string = '';
  userId: string = '';
  jobPostings: any[] = [];
  applicantsMap: { [id: string]: any } = {}; // Object to store applicant details

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private jobPostingService = inject(JobPostingService);
  private router = inject(Router);
  decodedUserId: any;

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.userRole = decodedToken.role;
      this.decodedUserId = decodedToken.userId;
    }
    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = params.get('id') || '';
    });
    this.loadProfile();
    this.loadJobPostings();
  }

  loadJobPostings(): void {
    this.jobPostingService.getAllJobPostingsByCurrentEmployer().subscribe({
      next: (data) => {
        this.jobPostings = data.content;
        this.fetchApplicantDetails();
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to load job postings.',
          'Close',
          5000
        );
        console.error('Error loading job postings:', error);
      },
    });
  }

  navigateToApplicant(applicantId: string): void {
    this.router.navigate([`/profile/applicant/${applicantId}`]);
  }

  loadProfile(): void {
    this.profileService.getApplicantProfile(this.userId).subscribe({
      next: (data) => {
        this.profileData = data;
      },
      error: (error) => {
        this.notificationService.show('Failed to load profile.', 'Close', 5000);
        console.error('Error loading profile:', error);
      },
    });
  }

  fetchApplicantDetails(): void {
    const applicantIds = this.jobPostings
      .flatMap((job) => job.applications)
      .map((application) => application.applicantId)
      .filter((value, index, self) => self.indexOf(value) === index);

    applicantIds.forEach((id) => {
      this.profileService.getApplicantById(id).subscribe((details) => {
        this.applicantsMap[id] = details;
      });
    });
  }

  openAddJobPostingDialog(): void {
    const dialogRef = this.dialog.open(AddJobPostingDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProfile();
      }
    });
  }
}
