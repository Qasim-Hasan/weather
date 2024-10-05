import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';  // Adjust the path based on your project structure

// Define an interface for the admin object
export interface AdminCreate {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = `${environment.apiUrl}admin/`;  // Ensure your API URL is set in environment

  constructor(private http: HttpClient) { }

  // Method to sign up a new admin
  createAdmin(admin: AdminCreate): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(this.apiUrl, admin, { headers });
  }
}
