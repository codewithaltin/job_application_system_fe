import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService } from '../../services/api/profile.service';

@Component({
  selector: 'app-add-experience-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Add Experience</h2>
    <form
      [formGroup]="experienceForm"
      (ngSubmit)="onSubmit()"
      class="flex flex-col gap-8 p-4"
    >
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required />
        <mat-error> Title is required </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Company</mat-label>
        <input matInput formControlName="company" required />
        <mat-error> Company is required </mat-error>
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
export class AddExperienceDialogComponent {
  experienceForm: FormGroup;

  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddExperienceDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string }) {
    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.experienceForm.valid) {
      this.profileService.addExperience(this.experienceForm.value).subscribe({
        next: () => {
          this.notificationService.show(
            'Experience added successfully!',
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
            'Failed to add experience.',
            'Close',
            5000,
            {
              panelClass: ['error-snackbar'],
            }
          );
          console.error('Failed to add experience:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
