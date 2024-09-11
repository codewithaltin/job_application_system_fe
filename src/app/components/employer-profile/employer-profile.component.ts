import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/api/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileTemplateComponent } from '../profile-header/profile-header.component';
import { AddJobPostingDialogComponent } from '../job-posting/add-job-posting-dialog.component';
@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [SharedModule, ProfileTemplateComponent],
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.scss',
})
export class EmployerProfileComponent {
  profileData: any = null;
  userRole: string = '';
  userId: string = '';

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.userRole = decodedToken.role;
    }
    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = params.get('id') || '';
    });
    this.loadProfile();
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

  openAddJobPostingDialog(): void {
    const dialogRef = this.dialog.open(AddJobPostingDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle post-creation actions, if necessary
        this.loadProfile();
      }
    });
  }
}
