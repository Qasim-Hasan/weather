import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false; // By default, user is not logged in
  private apiUrl = `${environment.apiUrl}admin/login`; // API URL from environment

  constructor(private http: HttpClient) {}

  // Method to send login credentials to the API
  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    // Make the POST request to the API and process the response
    return this.http.post<{ success: boolean, message: string }>(this.apiUrl, body, { headers })
      .pipe(
        map(response => {
          if (response.success) {
            this.loggedIn = true; // Set loggedIn to true on successful login
            return true; // Login successful
          }
          return false; // Login failed
        }),
        catchError(this.handleError) // Catch and handle errors
      );
  }

  logout() {
    this.loggedIn = false; // Reset loggedIn to false on logout
  }

  isLoggedIn(): boolean {
    return this.loggedIn; // Return the current login status
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message); // Log the error message

    // Optionally show a user-friendly error message
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return throwError('Something went wrong. Please try again later.');
  }
}


