import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsobarService {

  private apiUrl = `${environment.apiUrl}isobar`;

  constructor(private http: HttpClient) {}

  // Method to fetch isobar GeoJSON data
  getIsobarGeojson(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch isobar data. Please try again later.'));
  }
}
