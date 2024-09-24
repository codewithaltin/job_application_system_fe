import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../services/api/profile.service';
import { NotificationService } from '../../services/notification.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-add-education-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Add Education</h2>
    <form
      [formGroup]="educationForm"
      (ngSubmit)="onSubmit()"
      class="flex flex-col gap-8 p-4"
    >
      <mat-form-field>
        <mat-label>Field of Study</mat-label>
        <input matInput formControlName="fieldOfStudy" required />
        <mat-error> Field of Study is required </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>School</mat-label>
        <input matInput formControlName="school" required />
        <mat-error> School is required </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Start Date</mat-label>
        <input
          matInput
          [matDatepicker]="startDatePicker"
          formControlName="startDate"
          required
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="startDatePicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #startDatePicker></mat-datepicker>
        <mat-error> Start Date is required </mat-error>
      </mat-form-field>

      <mat-form-field>
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

      <mat-form-field>
        <mat-label>Location</mat-label>
        <input matInput formControlName="location" required />
        <mat-error> Location is required </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Grade</mat-label>
        <input matInput formControlName="grade" />
      </mat-form-field>

      <div class="dialog-actions">
        <button mat-button type="submit" color="primary">Add</button>
        <button mat-button (click)="onCancel()">Cancel</button>
      </div>
    </form>
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
  imports: [SharedModule],
})
export class AddEducationDialogComponent {
  educationForm: FormGroup;

  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddEducationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string }) {
    this.educationForm = this.fb.group({
      fieldOfStudy: ['', Validators.required],
      school: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      grade: [''],
    });
  }

  onSubmit(): void {
    if (this.educationForm.valid) {
      this.profileService.addEducation(this.educationForm.value).subscribe({
        next: () => {
          this.notificationService.show(
            'Education added successfully!',
            'Close',
            3000,
            {
              panelClass: ['success-snackbar'],
            }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notificationService.show(
            'Failed to add education.',
            'Close',
            5000,
            {
              panelClass: ['error-snackbar'],
            }
          );
          console.error('Failed to add education:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
