import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import * as Papa from 'papaparse';
import { environment } from '../../../environments/environment';

interface IsobarData {
  Title: string;      // City name
  Longitude: number;  // Longitude value
  Latitude: number;   // Latitude value
  Temperature: number; // Temperature value
  Humidity: number;    // Humidity value
}

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  private csvUrl = `${environment.apiUrl}isobar-csv`; // URL for CSV data

  constructor(private http: HttpClient) {}

  // Method to fetch CSV data from the FastAPI backend
  fetchCsvData(): Observable<IsobarData[]> {
    // Log a message to the console when the method is called
    console.log('Fetching CSV data from:', this.csvUrl);

    return new Observable<IsobarData[]>(observer => {
      this.http.get(this.csvUrl, { responseType: 'text' }).subscribe({
        next: (data: string) => this.parseCsvData(data, observer),
        error: (error) => this.handleFetchError(error, observer)
      });
    });
  }

  // Helper method to parse CSV data
  private parseCsvData(data: string, observer: any) {
    Papa.parse<IsobarData>(data, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
      complete: (results: Papa.ParseResult<IsobarData>) => {
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
