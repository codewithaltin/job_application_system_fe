import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileService } from '../../services/api/profile.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SharedModule } from '../../shared/shared.module';
import { AddEducationDialogComponent } from '../education/add-education-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AddExperienceDialogComponent } from '../experience/add-experience-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddSkillDialogComponent } from '../skill/add-skill-dialog.component';
import { ProfileTemplateComponent } from '../profile-header/profile-header.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './applicant-profile.component.html',
  styleUrls: ['./applicant-profile.component.scss'],
  imports: [
    NgIf,
    NgFor,
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    MatTabsModule,
    SharedModule,
    ProfileTemplateComponent,
  ],
  providers: [ProfileService],
})
export class ApplicantProfileComponent implements OnInit {
  userRole: string = '';
  userId: string = '';
  profileData: any = null;
  educationData: any[] = [];
  experienceData: any[] = [];
  skillsData: any[] = [];
  activeTab: 'education' | 'experience' | 'skills' = 'education';

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
    this.loadEducation();
    this.loadExperience();
    this.loadSkills();
  }
  showEducation() {
    this.activeTab = 'education';
  }

  showExperience() {
    this.activeTab = 'experience';
  }
  showSkills() {
    this.activeTab = 'skills';
  }

  loadSkills(): void {
    // Method to load skills
    this.profileService.getSkillsByUser(this.userId).subscribe({
      next: (data) => {
        this.skillsData = data;
        console.log('Skills data:', this.skillsData); // Debugging line
      },
      error: (error) => {
        this.notificationService.show('Failed to load skills.', 'Close', 5000);
        console.error('Error loading skills:', error);
      },
    });
  }

  loadEducation(): void {
    this.profileService.getEducationByUser(this.userId).subscribe({
      next: (data) => {
        this.educationData = data;
        console.log('Education data:', this.educationData); // Debugging line
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to load education.',
          'Close',
          5000
        );
        console.error('Error loading education:', error);
      },
    });
  }

  openAddEducationDialog(): void {
    const dialogRef = this.dialog.open(AddEducationDialogComponent, {
      width: '400px',
      data: { userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEducation();
      }
    });
  }
  openAddSkillDialog(): void {
    const dialogRef = this.dialog.open(AddSkillDialogComponent, {
      width: '400px',
      data: { userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSkills();
      }
    });
  }

  deleteEducation(educationId: string): void {
    this.profileService.deleteEducation(educationId).subscribe({
      next: () => {
        this.loadEducation();
        this.notificationService.show('Education entry deleted successfully!');
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to delete education.',
          'Close',
          5000,
          {
            panelClass: ['error-snackbar'],
          }
        );
        console.error('Error deleting education:', error);
      },
    });
  }
  deleteSkill(skillId: string): void {
    this.profileService.deleteSkill(skillId).subscribe({
      next: () => {
        this.loadSkills();
        this.notificationService.show('Skill entry deleted successfully!');
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to delete skill.',
          'Close',
          5000,
          {
            panelClass: ['error-snackbar'],
          }
        );
        console.error('Error deleting skill:', error);
      },
    });
  }

  loadExperience(): void {
    this.profileService.getExperienceByUser(this.userId).subscribe({
      next: (data) => {
        this.experienceData = data;
        console.log('Experience data:', this.experienceData);
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to load experience.',
          'Close',
          5000
        );
        console.error('Error loading experience:', error);
      },
    });
  }

  openAddExperienceDialog(): void {
    const dialogRef = this.dialog.open(AddExperienceDialogComponent, {
      width: '400px',
      data: { userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadExperience();
      }
    });
  }

  deleteExperience(experienceId: string): void {
    this.profileService.deleteExperience(experienceId).subscribe({
      next: () => {
        this.loadExperience();
        this.notificationService.show('Experience entry deleted successfully!');
      },
      error: (error) => {
        this.notificationService.show(
          'Failed to delete experience.',
          'Close',
          5000,
          {
            panelClass: ['error-snackbar'],
          }
        );
        console.error('Error deleting experience:', error);
      },
    });
  }
}
