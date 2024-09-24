import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private companyId: string = '';

  constructor(private authService: AuthService) {
    const socketUrl = 'http://localhost:8080/api/v1/ws';
    const socket = new SockJS(socketUrl);

    this.client = new Client({
      webSocketFactory: () => socket,
    });

    this.client.onConnect = () => {
      this.companyId = this.authService.getDecodedToken().userId;
      const role = this.authService.getDecodedToken().role;

      //TODO: fix the hub coonnection for company, it doesnt work currently!
      if (this.companyId && role === 'company') {
        this.client.subscribe(`/topic/notifications/company`, (message) => {
          if (message.body) {
            this.addNotification(message.body);
          }
        });
      }

      this.client.subscribe('/topic/notifications', (message) => {
        if (message.body) {
          this.addNotification(message.body);
        }
      });
    };

    this.client.activate();
  }

  addNotification(notification: string) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }
}
