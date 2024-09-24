import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SharedModule,
    MatMenuModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  role!: string;
  userId!: string;
  unreadNotifications: string[] = [];
  menuOpen = false;

  @ViewChild(MatMenuTrigger) notificationMenuTrigger!: MatMenuTrigger;

  constructor(
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    this.isAuthenticated$ = this.authService.authState$;
  }

  ngOnInit(): void {
    this.authService.authState$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        const decodedToken = this.authService.getDecodedToken();
        if (decodedToken) {
          this.role = decodedToken.role;
          this.userId = decodedToken.userId;
        }
      }
    });

    this.webSocketService.notifications$.subscribe((notifications) => {
      this.unreadNotifications = notifications;
    });
  }

  openNotificationMenu(): void {
    this.menuOpen = true;
  }

  closeNotificationMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
