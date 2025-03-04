import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parent } from './model/parent-model';

@Component({
  selector: 'app-parent-dialog',
  imports: [SharedModule],
  standalone: true,
  template: `
    <form [formGroup]="parentForm" class="m-4 p-8 flex gap-4 flex-col ">
      <h1 mat-dialog-title>{{ data.id ? 'Edit ' : 'Add ' }}</h1>

      <div>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Location</mat-label>
          <textarea matInput formControlName="location"></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button
          mat-button
          color="primary"
          (click)="onSave()"
          [disabled]="parentForm.invalid"
        >
          Save
        </button>
      </div>
    </form>
  `,
})
export class ParentDialogComponent {
  parentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Parent,
    private fb: FormBuilder
  ) {
    this.parentForm = this.fb.group({
      name: [data.name || '', Validators.required],
      location: [data.location || ''],
    });
  }

  onSave(): void {
    if (this.parentForm.invalid) return;
    this.dialogRef.close(this.parentForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
