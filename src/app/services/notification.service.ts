import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    config?: MatSnackBarConfig
  ): void {
    const snackBarConfig: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      ...config,
    };
    this.snackBar.open(message, action, snackBarConfig);
  }
}
