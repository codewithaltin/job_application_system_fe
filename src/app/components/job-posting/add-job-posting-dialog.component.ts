import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ProfileService } from '../../services/api/profile.service';
import { SharedModule } from '../../shared/shared.module';
import { JobPosting } from '../home/models/job-posting';
import { JobPostingService } from '../../services/job-posting.service';

@Component({
  selector: 'app-add-job-posting-dialog',
  standalone: true,
  imports: [SharedModule],
  template: `
    <form
      [formGroup]="jobPostingForm"
      (ngSubmit)="onSubmit()"
      class="job-posting-form"
    >
      <h2 mat-dialog-title>Add Job Posting</h2>

      <div class="form-row full-width">
        <mat-form-field class="form-field">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required />
          <mat-error> Title is required </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field class="form-field">
          <mat-label>Salary</mat-label>
          <input matInput type="number" formControlName="salary" required />
          <mat-error> Salary is required </mat-error>
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" required />
          <mat-error> Location is required </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field class="form-field">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" required />
          <mat-error> Category is required </mat-error>
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>Open Positions</mat-label>
          <input
            matInput
            type="number"
            formControlName="openPositions"
            required
          />
          <mat-error> Number of open positions is required </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field class="form-field">
          <mat-label>Post Date</mat-label>
          <input
            matInput
            [matDatepicker]="postDatePicker"
            formControlName="postDate"
            required
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="postDatePicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #postDatePicker></mat-datepicker>
          <mat-error> Post Date is required </mat-error>
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>End Date</mat-label>
          <input
            matInput
            [matDatepicker]="endDatePicker"
            formControlName="endDate"
            required
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="endDatePicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #endDatePicker></mat-datepicker>
          <mat-error> End Date is required </mat-error>
        </mat-form-field>
      </div>

      <mat-form-field class="form-field full-width">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" required></textarea>
        <mat-error> Description is required </mat-error>
      </mat-form-field>

      <div class="dialog-actions">
        <button mat-button type="submit" color="primary">Create</button>
        <button mat-button (click)="onCancel()">Cancel</button>
      </div>
    </form>
  `,
  styles: [
    `
      .job-posting-form {
        display: flex;
        gap: 8px;
        padding: 20px;
        flex-direction: column;
      }

      .form-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .form-field {
        flex: 1;
        margin-right: 16px;
      }

      .form-field:last-child {
        margin-right: 0;
      }

      .full-width {
        width: 100%;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class AddJobPostingDialogComponent {
  jobPostingForm: FormGroup;

  private jobPostingService = inject(JobPostingService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddJobPostingDialogComponent>);

  constructor() {
    this.jobPostingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: [0, Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      openPositions: [0, Validators.required],
      postDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.jobPostingForm.valid) {
      const jobPosting: JobPosting = this.jobPostingForm.value;

      this.jobPostingService.createJobPosting(jobPosting).subscribe({
        next: () => {
          this.notificationService.show(
            'Job posting created successfully!',
            'Close',
            3000,
            { panelClass: ['success-snackbar'] }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notificationService.show(
            'Failed to create job posting.',
            'Close',
            5000,
            { panelClass: ['error-snackbar'] }
          );
          console.error('Failed to create job posting:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
