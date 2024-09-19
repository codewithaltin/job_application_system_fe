import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgFor],
  template: `
    <div *ngFor="let notification of notifications">
      {{ notification }}
    </div>
  `,
})
export class NotificationComponent implements OnInit {
  notifications: string[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }
}
