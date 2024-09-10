import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService } from '../../services/api/profile.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile-template',
  standalone: true,
  imports: [SharedModule],
  template: `
    <!-- Profile Header -->
    <div class="flex items-center mb-8">
      <div
        class="w-36 h-36 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-6xl font-bold text-gray-600 border-4 border-white shadow-lg"
      >
        {{ profileData?.firstName[0] }}{{ profileData?.lastName[0] }}
      </div>
      <div class="ml-8">
        <h1 class="text-4xl font-extrabold text-gray-900">
          {{ profileData?.firstName }} {{ profileData?.lastName }}
        </h1>
        <p class="text-lg text-gray-700">{{ profileData?.title }}</p>
        <div class="mt-4">
          <button
            mat-button
            color="primary"
            class="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          Profile Details
        </h2>
        <div class="space-y-4">
          <div class="flex justify-start gap-2">
            <span class="font-semibold text-gray-600">Full name:</span>
            <span class="text-gray-800">
              {{ profileData?.firstName }} {{ profileData?.lastName }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">Email:</span>
            <span class="text-gray-800">{{ profileData?.email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">Phone:</span>
            <span class="text-gray-800">{{ profileData?.phone }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">Location:</span>
            <span class="text-gray-800">{{ profileData?.location }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
      }
      .profile-picture {
        width: 9rem;
        height: 9rem;
        background-color: #e2e8f0;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: bold;
        color: #4a5568;
        border: 4px solid #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .profile-header-info {
        margin-left: 2rem;
      }
      .profile-header-info h1 {
        font-size: 2rem;
        font-weight: 800;
        color: #1a202c;
      }
      .profile-header-info p {
        font-size: 1.125rem;
        color: #4a5568;
      }
      .edit-button {
        background-color: #3182ce;
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s;
      }
      .edit-button:hover {
        background-color: #2b6cb0;
      }
      .profile-details {
        padding: 1.5rem;
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .profile-details h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 1rem;
      }
      .profile-details .flex {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .profile-details .font-semibold {
        font-weight: 600;
        color: #4a5568;
      }
      .profile-details .text-gray-800 {
        color: #2d3748;
      }
    `,
  ],
})
export class ProfileTemplateComponent implements OnInit {
  @Input() userId!: string;
  profileData: any;

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
}
