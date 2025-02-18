import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material modules (a balanced set)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    MatTableModule,
    RouterModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class SharedModule {}
