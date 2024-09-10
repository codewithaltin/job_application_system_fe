import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  role!: string;
  userId!: string;

  constructor(private authService: AuthService, private router: Router) {
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
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
