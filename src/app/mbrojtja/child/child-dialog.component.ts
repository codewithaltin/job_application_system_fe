import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Child } from './model/child-model';
import { ParentService } from '../parent/service/parent.service';
import { Parent } from '../parent/model/parent-model';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-child-dialog',
  imports: [SharedModule],
  standalone: true,
  template: `
    <form [formGroup]="childForm" class="m-4 p-8 flex gap-4 flex-col">
      <h1 mat-dialog-title>{{ data.id ? 'Edit ' : 'Add ' }} Child</h1>
      <div>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Select Parent</mat-label>
          <mat-select formControlName="parent">
            <mat-option *ngFor="let parent of parents" [value]="parent.id">
              {{ parent.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button
          mat-button
          color="primary"
          (click)="onSave()"
          [disabled]="childForm.invalid"
        >
          Save
        </button>
      </div>
    </form>
  `,
})
export class ChildDialogComponent {
  childForm: FormGroup;
  parents: Parent[] = [];

  constructor(
    public dialogRef: MatDialogRef<ChildDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Child,
    private fb: FormBuilder,
    private parentService: ParentService
  ) {
    this.loadParents();
    this.childForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      parent: [data.parent?.id || null, Validators.required],
    });
  }

  loadParents(): void {
    this.parentService.getAll().subscribe((parents) => {
      this.parents = parents || [];
    });
  }

  onSave(): void {
    if (this.childForm.invalid) return;
    this.dialogRef.close(this.childForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
