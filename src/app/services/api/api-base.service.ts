import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ApiBaseService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}



  get<T>(endpoint: string, options?: { params?: HttpParams }): Observable<T> {
    return this.httpClient
      .get<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.httpClient
      .post<T>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(
    endpoint: string,
    body: any,
    options: any = {}
  ): Observable<HttpEvent<T>> {
    return this.httpClient
      .put<T>(`${this.apiUrl}/${endpoint}`, body, {
        ...options,
        observe: 'response', // Use 'response' to get the full HttpEvent
      })
      .pipe(catchError(this.handleError));
  }
  delete<T>(endpoint: string): Observable<T> {
    return this.httpClient
      .delete<T>(`${this.apiUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {

    let errorMessage = 'Unknown error!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }


    if (error.message.includes("401")) {
      return this.refreshToken().pipe(
        switchMap((newTokenResponse: JwtAuthenticationResponseDTO) => {
          
          localStorage.setItem('accessToken', newTokenResponse.token);
          localStorage.setItem('refreshToken', newTokenResponse.refreshToken);
          
          return throwError(() => new Error('Retry the request with new token'));
        }),
        catchError(refreshError => {
          return throwError(() => new Error('Failed to refresh token'));
        })
      );
    }
  
    return throwError(() => new Error(errorMessage));
  }
  

  private refreshToken(): Observable<JwtAuthenticationResponseDTO> {
    debugger
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (!storedRefreshToken) {
      return throwError(() => new Error('Refresh token is missing'));
    }

  

    return this.httpClient
      .post<JwtAuthenticationResponseDTO>(`${this.apiUrl}/refresh-token`, {
        refreshToken: storedRefreshToken,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Error refreshing token'));
        })
      );
  }

}

interface JwtAuthenticationResponseDTO {
  token: string;
  refreshToken: string;
}