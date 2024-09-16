import { Component, inject, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService } from '../../services/api/profile.service';
import { NotificationService } from '../../services/notification.service';
import { UpdateProfileDialogComponent } from './update-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-template',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-initials">
          {{ profileData?.firstName[0] }}{{ profileData?.lastName[0] }}
        </div>
        <div class="profile-info">
          <h1 class="profile-name">
            {{ profileData?.firstName }} {{ profileData?.lastName }}
          </h1>
          <p class="profile-title">{{ profileData?.title }}</p>
          <div class="profile-actions">
            <button
              *ngIf="userId === decodedUserId"
              mat-button
              color="primary"
              class="edit-button"
              (click)="openUpdateDialog()"
            >
              Edit Profile
            </button>
            <button
              *ngIf="userId !== decodedUserId"
              mat-button
              color="primary"
              class="edit-button"
              (click)="sendEmail(profileData.email)"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="profile-details-container">
        <div class="profile-details">
          <h2 class="profile-details-header">Profile Details</h2>
          <div class="details-content">
            <div class="details-row">
              <span class="label">Full name:</span>
              <span class="value"
                >{{ profileData?.firstName }} {{ profileData?.lastName }}</span
              >
            </div>
            <div class="details-row">
              <span class="label">Email:</span>
              <span class="value">{{ profileData?.email }}</span>
            </div>
            <div class="details-row">
              <span class="label">Phone:</span>
              <span class="value">{{ profileData?.phone }}</span>
            </div>
            <div class="details-row">
              <span class="label">Location:</span>
              <span class="value">{{ profileData?.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 2rem;

        .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;

          .profile-initials {
            width: 9rem;
            height: 9rem;
            background-color: #e2e8f0; // gray-200
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3.75rem; // 6xl
            font-weight: bold;
            color: #4b5563; // gray-600
            border: 4px solid white;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); // shadow-lg
          }

          .profile-info {
            margin-left: 2rem;

            .profile-name {
              font-size: 2.25rem; // 4xl
              font-weight: 800; // extrabold
              color: #1f2937; // gray-900
            }

            .profile-title {
              font-size: 1.125rem; // lg
              color: #374151; // gray-700
            }

            .profile-actions {
              margin-top: 1rem;

              .edit-button {
                background-color: #3b82f6; // blue-500
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); // shadow-md
                transition: background-color 0.2s ease-in-out;

                &:hover {
                  background-color: #2563eb; // blue-600
                }
              }
            }
          }
        }

        .profile-details-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;

          @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr; // md:grid-cols-2
          }

          .profile-details {
            padding: 1.5rem;
            background-color: #f9fafb; // gray-50
            border: 1px solid #e5e7eb; // gray-200
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05); // shadow-md

            .profile-details-header {
              font-size: 1.5rem; // 2xl
              font-weight: 600;
              margin-bottom: 1rem;
              color: #1f2937; // gray-800
            }

            .details-content {
              .details-row {
                display: flex;
                justify-content: space-between;
                gap: 0.5rem;
                margin-bottom: 1rem;

                .label {
                  font-weight: 600;
                  color: #4b5563; // gray-600
                }

                .value {
                  color: #1f2937; // gray-800
                }
              }
            }
          }
        }
      }
    `,
  ],
})
export class ProfileTemplateComponent implements OnInit {
  @Input() userId!: string;
  @Input() decodedUserId!: string;
  profileData: any;
  private dialog = inject(MatDialog);

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
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
  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
      data: {
        userId: this.userId,
        profileData: this.profileData,
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProfile();
      }
    });
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
