import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import * as Papa from 'papaparse';

interface Station {
  Title: string;       // Station name
  Longitude: number;   // Longitude of the station
  Latitude: number;    // Latitude of the station
  Temperature: number; // Temperature at the station
  Humidity: number;    // Humidity at the station
}


@Component({
  selector: 'app-isonephs',
  templateUrl: './isonephs.component.html',
  styleUrls: ['./isonephs.component.css']
})
export class IsonephsComponent implements OnInit, OnDestroy {
  private map: L.Map | undefined;
  private stationLayer: L.LayerGroup; // LayerGroup for stations
  private isonephDataUrl: string = '../../../assets/isonephs.geojson';
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';
  private updateIntervalId: any; // To track the interval ID
  private isonephLayer: L.GeoJSON | undefined; // Variable for IsoNeph layer
 labelsVisible: boolean = true; // Track the state of labels

  constructor() {
    this.stationLayer = L.layerGroup(); // Initialize LayerGroup for stations
  }

  ngOnInit() {
    this.initializeMap();
    this.addIsoNephLayer(); // Load GeoJSON layer first
    this.loadStations(); // Load stations from CSV
  }

  ngOnDestroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  private initializeMap() {
    this.map = L.map('map5').setView([30.3753, 69.3451], 5); // Center on Pakistan and zoom level 5

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 1,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 0.5,
      noWrap: true
    }).addTo(this.map);

    this.addShapefileLayer(); // Uncomment if you want to add shapefile layer
  }

  private async loadStations() {
    try {
      const response = await fetch('../../../assets/station.csv');
      const text = await response.text();

      const stations: Station[] = [];
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          console.log('CSV parsing results:', results.data); // Log parsed data
          results.data.forEach((station: any) => {
            console.log('Parsed station:', station); // Debugging statement

            if (station.Title && station.Title.trim() && station.Longitude !== undefined && station.Latitude !== undefined) {
              stations.push({
                Title: station.Title.trim(),  // Trim whitespace
                Longitude: station.Longitude,
                Latitude: station.Latitude,
                Temperature: station.Temperature, // Add temperature
                Humidity: station.Humidity        // Add humidity
              });
            } else {
              console.error('Station data is missing required fields:', station);
            }
          });
          console.log('Parsed stations:', stations); // Log parsed stations
          this.addStationLayer(stations); // Add markers to the map
        }
      });

    } catch (error) {
      console.error('Error loading stations CSV:', error);
    }
  }

  private addStationLayer(stations: Station[]) {
    console.log('Adding station layer with stations:', stations);

    stations.forEach(station => {
      const marker = L.marker([station.Latitude, station.Longitude], {
        zIndexOffset: 1000 // Set a higher z-index for markers
      });

      // Create a divIcon for the station info
      const labelIcon = L.divIcon({
        className: 'station-label',
        html: `
          <div style="font-weight: bold; font-size: 12px;">
            ${station.Title}<br>
            Temp: ${station.Temperature} °C<br>
            Humidity: ${station.Humidity} %
          </div>
        `,
        iconSize: [100, 50],
        iconAnchor: [50, 25] // Center the label over the marker
      });

      // Add the label to the map
      L.marker([station.Latitude, station.Longitude], { icon: labelIcon }).addTo(this.map!);

      // Add the marker to the station layer
      this.stationLayer.addLayer(marker);
    });

    // Add the marker layer to the map
    this.stationLayer.addTo(this.map!);
    console.log('Station markers added to the map.'); // Debug log
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

    const shp = (await import('shpjs')).default;
    shp(this.shapefileUrl).then((data: any) => {
      geoLayer.addData(data);
    }).catch((error: any) => {
      console.error('Error loading shapefile:', error);
    });
  }

  private addIsoNephLayer() {
    this.updateIsoNephLayer();
    this.startIsoNephAnimation();
  }

  private updateIsoNephLayer() {
    if (!this.map) return;

    if (this.isonephLayer) {
      this.map.removeLayer(this.isonephLayer);
    }

    fetch(this.isonephDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isoneph data:', data);
          this.isonephLayer = L.geoJSON(data, {
            style: (feature) => this.getIsoNephStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(`Cloud Cover: ${feature.properties.cloud_cover} %`);
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isoneph GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching isoneph data:', error);
      });
  }

  private getIsoNephStyle(feature: any): L.PathOptions {
    const cloudCover = feature.properties.cloud_cover || 0;
    let fillColor = 'rgba(255, 255, 255, 0.5)'; // Default color

    if (cloudCover > 75) {
      fillColor = 'rgba(0, 0, 0, 0.5)'; // Black for very high cloud cover
    } else if (cloudCover > 50) {
      fillColor = 'rgba(105, 105, 105, 0.5)'; // Dim gray for high cloud cover
    } else if (cloudCover > 25) {
      fillColor = 'rgba(169, 169, 169, 0.5)'; // Dark gray for moderate cloud cover
    } else if (cloudCover > 0) {
      fillColor = 'rgba(192, 192, 192, 0.5)'; // Silver for low cloud cover
    } else {
      fillColor = 'rgba(220, 220, 220, 0.5)'; // Gainsboro for very low cloud cover
    }

    return {
      fillColor: fillColor,
      weight: 5, // Increased weight for bolder lines
      opacity: 0.9, // Full opacity for lines
      color: 'gray', // Line color
      dashArray: '2, 6', // Dashed lines for distinctiveness
      fillOpacity: 0.6
    };
  }

  private startIsoNephAnimation() {
    this.updateIntervalId = setInterval(() => this.updateIsoNephLayer(), 5000);
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }

  // Toggle all labels visibility
  toggleLabels() {
    if (this.labelsVisible) {
      this.map!.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getLatLng) {
          const markerPosition = layer.getLatLng();
          this.map!.removeLayer(layer);
        }
      });
    } else {
      this.loadStations(); // Reload stations to show labels again
    }
    this.labelsVisible = !this.labelsVisible; // Toggle the state
  }
}
