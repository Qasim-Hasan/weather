import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';
import { environment } from '../../../environments/environment';

export interface StationData {
  Title: string;
  Longitude: number;
  Latitude: number;
  Temperature: number;
  Humidity:number;
  High_cloud: number;
  Low_cloud:number;
  Mid_cloud:number;
  windSpeed_windDirection:string;
  Sky_cover:number;
 }


@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  private csvUrl = `${environment.apiUrl}csv`; // URL for CSV data

  constructor(private http: HttpClient) {}

  // Method to fetch CSV data from the FastAPI backend without caching
  fetchCsvData(): Observable<StationData[]> {
    // Append a timestamp query parameter to prevent caching
    const urlWithNoCache = `${this.csvUrl}?_=${new Date().getTime()}`;

    console.log('Fetching CSV data from:', urlWithNoCache);

    return new Observable<StationData[]>(observer => {
      this.http.get(urlWithNoCache, { responseType: 'text' }).subscribe({
        next: (data: string) => this.parseCsvData(data, observer),
        error: (error) => this.handleFetchError(error, observer)
      });
    });
  }

  // Helper method to parse CSV data
  private parseCsvData(data: string, observer: any) {
    Papa.parse<StationData>(data, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
      complete: (results: Papa.ParseResult<StationData>) => {
        if (results.data && results.data.length > 0) {
          observer.next(results.data); // Emit the parsed data array
        } else {
          observer.error('Parsed data is empty or invalid');
        }
        observer.complete();
      },
      error: (error) => observer.error('Error during CSV parsing: ' + error.message)
    });
  }

  // Centralized error handling for fetch operations
  private handleFetchError(error: any, observer: any) {
    console.error('Error fetching data:', error);
    observer.error(error);
  }
}
