import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, CommonModule, MatTabsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isUserRole: boolean = true; // Default to 'APPLICANT'

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      role: ['APPLICANT', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.onRoleChange({ index: 0 });
  }

  // Method to handle role changes
  onRoleChange(event: any): void {
    this.isUserRole = event.index === 0;

    const firstNameControl = this.registerForm.get('firstName');
    const lastNameControl = this.registerForm.get('lastName');

    if (this.isUserRole) {
      firstNameControl?.setValidators([Validators.required]);
      lastNameControl?.setValidators([Validators.required]);
    } else {
      firstNameControl?.setValidators([Validators.required]);
      lastNameControl?.setValue('');
      lastNameControl?.setValidators(null);
    }

    firstNameControl?.updateValueAndValidity();
    lastNameControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      formValue.role = this.isUserRole ? 'APPLICANT' : 'EMPLOYER';

      this.authService.signUp(formValue).subscribe({
        next: () => {
          this.notificationService.show('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.notificationService.show(error);
        },
      });
    }
  }
}
