import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ProfileService } from '../../services/api/profile.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-add-skill-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Add Skill</h2>
    <form
      [formGroup]="skillForm"
      (ngSubmit)="onSubmit()"
      class="flex flex-col gap-8 p-4"
    >
      <mat-form-field>
        <mat-label>Skill Name</mat-label>
        <input matInput formControlName="name" required />
        <mat-error> Skill Name is required </mat-error>
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
export class AddSkillDialogComponent {
  skillForm: FormGroup;

  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddSkillDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string }) {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.skillForm.valid) {
      const skillData = {
        user: this.data.userId,
        ...this.skillForm.value,
      };
      this.profileService.addSkill(skillData).subscribe({
        next: () => {
          this.notificationService.show(
            'Skill added successfully!',
            'Close',
            3000,
            {
              panelClass: ['success-snackbar'],
            }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notificationService.show('Failed to add skill.', 'Close', 5000, {
            panelClass: ['error-snackbar'],
          });
          console.error('Failed to add skill:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
