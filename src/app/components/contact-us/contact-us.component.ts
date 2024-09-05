// contact-us.component.ts
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactUsService } from '../../services/contact-us.service';
import { ContactUsRequest } from './models/contact-us';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  imports: [SharedModule],
})
export class ContactUsComponent {
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.contactForm.valid) {
      const formValue: ContactUsRequest = this.contactForm.value;
      this.contactUsService.sendContactUsForm(formValue).subscribe({
        next: () => {
          this.notificationService.show('Message sent successfully!');
          this.contactForm.reset();
        },
        error: () => {
          this.notificationService.show(
            'Failed to send message. Please try again later.'
          );
        },
      });
    }
  }
}
