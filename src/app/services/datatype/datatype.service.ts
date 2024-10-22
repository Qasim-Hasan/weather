import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatatypeService {
  private apiDataUrl = `${environment.apiUrl}data-type`;

  constructor(private http: HttpClient) {}

  // Method to send the data type to the backend
  sendDataType(datatype: string): Observable<any> {
    const body = { datatype }; // Create a request body
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiDataUrl, body, { headers });
  }
}
