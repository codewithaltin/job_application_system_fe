import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/api/profile.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-profile-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Update Profile</h2>
    <form
      [formGroup]="profileForm"
      (ngSubmit)="onSubmit()"
      class="flex flex-col gap-4 p-4"
    >
      <mat-form-field *ngIf="role === 'APPLICANT' || role === 'EMPLOYER'">
        <mat-label>{{
          role === 'APPLICANT' ? 'First Name' : 'Company Name'
        }}</mat-label>
        <input matInput formControlName="firstName" />
        <mat-error *ngIf="profileForm.get('firstName')?.hasError('minlength')">
          First name must be at least 2 characters
        </mat-error>
        <mat-error *ngIf="profileForm.get('firstName')?.hasError('maxlength')">
          First name cannot be more than 50 characters
        </mat-error>
      </mat-form-field>

      <mat-form-field *ngIf="role === 'APPLICANT'">
        <mat-label>Last Name</mat-label>
        <input matInput formControlName="lastName" />
        <mat-error *ngIf="profileForm.get('lastName')?.hasError('minlength')">
          Last name must be at least 2 characters
        </mat-error>
        <mat-error *ngIf="profileForm.get('lastName')?.hasError('maxlength')">
          Last name cannot be more than 50 characters
        </mat-error>
      </mat-form-field>

      <!-- Date of Birth 
      <mat-form-field>
        <mat-label>Date of Birth</mat-label>
        <input
          matInput
          [matDatepicker]="dobPicker"
          formControlName="dateOfBirth"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="dobPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #dobPicker></mat-datepicker>
        <mat-error *ngIf="profileForm.get('dateOfBirth')?.hasError('required')">
          Date of Birth is required
        </mat-error>
      </mat-form-field>

      <div class="dialog-actions">
        <button mat-button type="submit" color="primary">Save</button>
        <button mat-button (click)="onCancel()">Cancel</button>
      </div>
    </form> -->
  `,
  styles: [
    `
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
  ],
})
export class UpdateProfileDialogComponent {
  profileForm: FormGroup;
  role: string;

  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<UpdateProfileDialogComponent>);
  private jwtService = inject(AuthService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: string; profileData: any }
  ) {
    const decodedToken = this.jwtService.getDecodedToken();
    this.role = decodedToken.role;

    this.profileForm = this.fb.group({
      firstName: [
        data.profileData.firstName,
        [Validators.minLength(2), Validators.maxLength(50)],
      ],
      lastName: [
        data.profileData.lastName,
        this.role == 'APPLICANT'
          ? [Validators.minLength(2), Validators.maxLength(50)]
          : [],
        ,
      ],
      dateOfBirth: [data.profileData.dateOfBirth],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.profileService
        .updateProfile(this.data.userId, this.profileForm.value)
        .subscribe({
          next: () => {
            this.notificationService.show(
              'Profile updated successfully!',
              'Close',
              3000
            );
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.notificationService.show(
              'Failed to update profile.',
              'Close',
              5000
            );
            console.error('Failed to update profile:', error);
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
