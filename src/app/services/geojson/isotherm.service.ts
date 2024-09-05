import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class IsothermService {

  private apiUrl = `${environment.apiUrl}isotherm`;

  constructor(private http: HttpClient) {}

  // Method to fetch isotherm GeoJSON data
  getIsothermGeojson(): Observable<any> {
    // Log a message to the console when the method is called
    console.log('Fetching isotherm GeoJSON data from:', this.apiUrl);

    return this.http.get(this.apiUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError),
    // Log the fetched data
    tap(data => console.log('Isotherm layer added to the map:', data)));
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch isotherm data. Please try again later.'));
  }
}
