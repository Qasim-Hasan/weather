import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { StationData } from '../../models/station_model'; // Adjust the import based on your project structure
import { CsvDataService } from '../../services/csv/csv-data.service';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service';
import { IsobarService } from '../../services/geojson/isobar.service';

@Component({
  selector: 'app-isobars',
  templateUrl: './isobars.component.html',
  styleUrls: ['./isobars.component.css']
})
export class IsobarsComponent implements OnInit, OnDestroy {
  private map: L.Map | undefined;
  private isobarLayer: L.GeoJSON | undefined;
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';
  private intervalId: any;
  private pngUrl: string | undefined; // Variable to store the PNG URL
  private stationData: StationData[] = []; // Use the StationData interface

  // New properties for toggle
  public isobarLayerVisible: boolean = true; // Initially show isobars
  public stationMarkersVisible: boolean = true; // Initially show station markers
  public pngOverlayVisible: boolean = true; // Initially show PNG overlay
  private imageOverlay: L.ImageOverlay | undefined; // To manage the image overlay
  private stationMarkers: L.Marker[] = []; // Store references to station markers

  // Store bounds for the image overlay
  private overlayBounds: L.LatLngBounds | undefined;
  constructor(private csvDataService:CsvDataService,
    private isobarImageDataService: IsobarImageDataService,private isobarService: IsobarService
  ) {}

  ngOnInit() {
    this.initializeMap();
    this.loadIsobarData(); // Call to load isobar data
    this.fetchStationData(); // Fetch station data from the CSV
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeMap() {
    // Set the initial map view
    this.map = L.map('map2', {
      center: [30.3753, 69.3451], // Center on Pakistan
      zoom: 6, // Default zoom level
      minZoom: 5, // Allow zooming out to level 0
      maxZoom: 14 // Adjust as needed
    });

    // Define the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18, // Maximum zoom level
      minZoom: 5,  // Minimum zoom level (allows zooming out)
      tileSize: 256,
      zoomOffset: 0,
      opacity: 1, // Full opacity
      noWrap: true
    }).addTo(this.map);


    this.addShapefileLayer();
    this.addIsobarLayer(); // Now it also fetches station markers
  }

  private loadIsobarData() {
    this.isobarImageDataService.getIsobarData().subscribe(
      data => {
        console.log('Fetched isobar data:', data);
        this.pngUrl = data.png_url; // Store the PNG URL

        if (data.coordinates && data.coordinates.bounds && Array.isArray(data.coordinates.bounds)) {
          // Convert the bounds to Leaflet LatLngBounds
          this.overlayBounds = L.latLngBounds(data.coordinates.bounds.map((coord: [number, number]) => L.latLng(coord[1], coord[0])));

          console.log('Image URL:', this.pngUrl); // Log the URL for debugging
          console.log('Overlay bounds:', this.overlayBounds); // Log the bounds for debugging

          this.addOverlayImage(); // Pass the bounds for the overlay image
        } else {
          console.error('Invalid bounds structure:', data.coordinates);
        }
      },
      error => {
        console.error('Error fetching isobar data:', error);
      }
    );
  }

  private addOverlayImage() {
    if (!this.map || !this.pngUrl || !this.overlayBounds) return;

    // Remove existing overlay if it exists
    if (this.imageOverlay) {
      this.imageOverlay.remove();
    }

    // Add the image overlay
    this.imageOverlay = L.imageOverlay(this.pngUrl, this.overlayBounds, {
      opacity: 0.4,
      interactive: true
    }).addTo(this.map);
  }

  private addShapefileLayer() {
    this.updateShapefileLayer();
  }

  private async updateShapefileLayer() {
    if (!this.map) return;

    const geoLayer = L.geoJSON(null, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const properties = Object.keys(feature.properties)
            .map(key => `${key}: ${feature.properties[key]}`)
            .join("<br />");
          layer.bindPopup(properties);
        }
      }
    }).addTo(this.map);

    try {
      const shp = (await import('shpjs')).default;
      const data = await shp(this.shapefileUrl);
      geoLayer.addData(data);
    } catch (error) {
      console.error('Error loading shapefile:', error);
    }
  }

  private addIsobarLayer() {
    this.updateIsobarLayer();
    this.startIsobarAnimation();
  }

  private updateIsobarLayer() {
    if (!this.map) return;

    if (this.isobarLayer) {
      this.map.removeLayer(this.isobarLayer);
    }

    this.isobarService.getIsobarGeojson().subscribe(
      data => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isobar data from API:', data);

          this.isobarLayer = L.geoJSON(data, {
            style: {
              color: 'black', // Set a fixed color for all lines
              weight: 1, // Set the weight to make the line bolder
              opacity: 0.5 // Set opacity to fully opaque
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup('Isobar Line'); // Display a default message in the popup
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isobar GeoJSON data:', data);
        }
      },
      error => {
        console.error('Error fetching isobar data:', error);
      }
    );
  }

  private startIsobarAnimation() {
    this.intervalId = setInterval(() => this.updateIsobarLayer(), 60000);
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }

  private addStationMarkers() {
    if (!this.map) return;

    console.log('Adding station markers with data:', this.stationData);

    this.stationData.forEach(station => {
      // Check if station data has valid latitude, longitude, and title
      if (station.Latitude !== undefined && station.Longitude !== undefined && station.Title) {
        // Create a custom icon for the station
        const customIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `
            <div style="text-align: center;">
              <img src="../../../assets/pin.png" style="width: 50px; height: 50px;" alt="Station Icon"><br>
              <strong>${station.Title}</strong><br>
              Temp: ${station.Temperature} °C<br>
              Humidity: ${station.Humidity} %
            </div>
          `,
          iconSize: [120, 120], // Size of the icon
          iconAnchor: [60, 60]  // Anchor point of the icon
        });

        // Add the custom icon as a marker on the map
        const marker = L.marker([station.Latitude, station.Longitude], {
          icon: customIcon
        });

        marker.addTo(this.map!);
        this.stationMarkers.push(marker); // Store reference to the marker

        // Optional: Bind a popup with additional information
        marker.bindPopup(`
          <strong>${station.Title}</strong><br>
          Temperature: ${station.Temperature}°C<br>
          Humidity: ${station.Humidity}%
        `);
      }
    });

    console.log('Custom station markers added to the map.');
  }

  private fetchStationData() {
    this.csvDataService.fetchCsvData().subscribe(
      (data: StationData[]) => {
        this.stationData = data; // Assign fetched data to stationData
        this.addStationMarkers(); // Add markers for the fetched stations
      },
      error => {
        console.error('Error fetching station data:', error);
      }
    );
  }

  // Method to toggle isobar layer visibility
  toggleIsobarLayer() {
    if (this.isobarLayerVisible) {
      this.map?.removeLayer(this.isobarLayer!);
    } else {
      this.addIsobarLayer(); // Re-add isobar layer
    }
    this.isobarLayerVisible = !this.isobarLayerVisible; // Toggle state
  }

  // Method to toggle station markers visibility
  toggleStationMarkers() {
    if (this.stationMarkersVisible) {
      this.stationMarkers.forEach(marker => marker.remove()); // Remove markers
    } else {
      this.addStationMarkers(); // Re-add markers
    }
    this.stationMarkersVisible = !this.stationMarkersVisible; // Toggle state
  }

  // Method to toggle PNG overlay visibility
  togglePngOverlay() {
    if (this.pngOverlayVisible) {
      this.imageOverlay?.remove(); // Remove PNG overlay
    } else {
      this.addOverlayImage(); // Add overlay with stored bounds
    }
    this.pngOverlayVisible = !this.pngOverlayVisible; // Toggle state
  }
}

