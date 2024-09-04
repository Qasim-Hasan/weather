import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' // Makes this service available throughout the app
})
export class IsobarDataService {

  // Define the API URLs using environment variables for better configurability
  private apiUrl = `${environment.apiUrl}isobar`;
  private apiUrlimage = `${environment.apiUrl}isobar-data`;

  constructor(private http: HttpClient) { }

  // Method to fetch isobar GeoJSON data
  getIsobarGeojson(): Observable<any> {
    const params = new HttpParams().set('cb', Date.now().toString());  // Cache-busting parameter
    return this.http.get(this.apiUrl, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)  // Handle errors using the private method
      );
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);  // Log error details to the console
    return throwError(() => new Error('Failed to fetch isobar data. Please try again later.'));
  }

  // Method to fetch specific isobar data
  getIsobarData(): Observable<any> {
    return this.http.get<any>(this.apiUrlimage).pipe(
      catchError(this.handleError)  // Handle errors similarly
    );
  }
}


/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Import the environment configuration

@Injectable({
  providedIn: 'root'
})
export class IsobarDataService {

  private apiUrl = ${environment.apiUrl}isobar;  // Use the apiUrl from environment

  constructor(private http: HttpClient) { }

  getIsobarGeojson(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' });
  }
}
*/
