import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from './api/api-base.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiBaseService {
  private authStateSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authState$: Observable<boolean> = this.authStateSubject.asObservable();

  signUp(signUpRequest: any): Observable<any> {
    return this.post('sign-up', signUpRequest);
  }

  signIn(signInRequest: any): Observable<any> {
    return this.post('sign-in', signInRequest);
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwt_token', token);
    this.authStateSubject.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  logout(): void {
    sessionStorage.removeItem('jwt_token');
    this.authStateSubject.next(false);
  }
}
