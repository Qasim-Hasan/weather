import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsobarImageDataService {
  private apiUrlImage = `${environment.apiUrl}isobar-data`;

  constructor(private http: HttpClient) {}

  // Method to fetch specific isobar data
  getIsobarData(): Observable<any> {
    return this.http.get<any>(this.apiUrlImage).pipe(catchError(this.handleError));
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch isobar image data. Please try again later.'));
  }
}
