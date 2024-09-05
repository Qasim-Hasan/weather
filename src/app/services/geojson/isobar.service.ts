import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsobarService {

  private apiUrl = `${environment.apiUrl}isobar`;

  constructor(private http: HttpClient) {}

  // Method to fetch isobar GeoJSON data (no caching)
  getIsobarGeojson(): Observable<any> {
    console.log('Fetching isobar GeoJSON data from:', this.apiUrl);

    return this.http.get(this.apiUrl, { responseType: 'json' })
      .pipe(
        catchError(this.handleError),
        // Log the fetched data
        tap(data => console.log('Isobar layer added to the map:', data))
      );
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch isobar data. Please try again later.'));
  }


}
