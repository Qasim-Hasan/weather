import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { StationData } from '../../models/station_model';
import { CsvDataService } from '../../services/csv/csv-data.service';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service';
import 'leaflet.markercluster';

@Component({
  selector: 'app-isobars',
  templateUrl: './isobars.component.html',
  styleUrls: ['./isobars.component.css']
})
export class IsobarsComponent implements OnInit {
  private map: L.Map | undefined;
  private geoJsonUrl: string = '../../../assets/world-administrative-boundaries.geojson'; // Updated to GeoJSON
  private pngUrl: string | undefined;
  private heatmapUrl: string | undefined; // New property for heatmap URL
  private stationData: StationData[] = [];
  public stationMarkersVisible: boolean = true;
  public pngOverlayVisible: boolean = true;
  private imageOverlay: L.ImageOverlay | undefined;
  private heatmapOverlay: L.ImageOverlay | undefined; // New property for heatmap overlay
  private stationMarkers: L.Marker[] = [];
  private overlayBounds: L.LatLngBounds | undefined;

  // Initialize stationMarkersCluster with maxClusterRadius option
private stationMarkersCluster: L.MarkerClusterGroup = L.markerClusterGroup({
  maxClusterRadius: 160, // Adjust this value as needed
});

  public selectedImageType: string = 'isobar'; // Default value

  constructor(
    private csvDataService: CsvDataService,
    private isobarImageDataService: IsobarImageDataService
  ) {}

  ngOnInit() {
    this.initializeMap();
    this.loadIsobarData(); // You can specify the image type here
    this.fetchStationData();
  }

  private initializeMap() {
    this.map = L.map('map2', {
      center: [30.3753, 69.3451],
      zoom: 6,
      minZoom: 4,
      maxZoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 5,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 1,
      noWrap: true
    }).addTo(this.map);

    this.addGeoJsonLayer(); // Change method call to load GeoJSON
  }

  public loadIsobarData() {
    const imageType = this.selectedImageType; // Use the selected image type
    this.isobarImageDataService.getIsobarData(imageType).subscribe(
      (data) => {
        this.pngUrl = data.layer_image_url;
        this.heatmapUrl = data.heatmap_image_url;

        if (data.coordinates && data.coordinates.bounds && Array.isArray(data.coordinates.bounds)) {
          this.overlayBounds = L.latLngBounds(
            data.coordinates.bounds.map((coord: [number, number]) => L.latLng(coord[1], coord[0]))
          );
          this.addOverlayImage();
          this.addHeatmapImage();
        }
      },
      (error) => {
        console.error(`Error loading isobar data for ${imageType}:`, error);
        // Optionally notify user or take other actions
      }
    );
  }


  private addOverlayImage() {
    if (!this.map || !this.pngUrl || !this.overlayBounds) return;

    // Remove previous overlays
    if (this.imageOverlay) {
      this.imageOverlay.remove();
    }

    this.imageOverlay = L.imageOverlay(this.pngUrl, this.overlayBounds, {
      opacity: 1,
      interactive: true
    }).addTo(this.map);
  }

  private addHeatmapImage() {
    if (!this.map || !this.heatmapUrl || !this.overlayBounds) return;

    // Remove previous heatmap overlay
    if (this.heatmapOverlay) {
      this.heatmapOverlay.remove();
    }

    this.heatmapOverlay = L.imageOverlay(this.heatmapUrl, this.overlayBounds, {
      opacity: 0.9,
      interactive: true
    }).addTo(this.map);
  }

  private addGeoJsonLayer() {
    this.updateGeoJsonLayer(); // Call the updated method to load GeoJSON
  }

  private async updateGeoJsonLayer() {
    if (!this.map) return;

    const geoLayer = L.geoJSON(null, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const properties = Object.keys(feature.properties)
            .map(key => `${key}: ${feature.properties[key]}`)
            .join('<br />');
          layer.bindPopup(properties);
        }
      }
    }).addTo(this.map);

    try {
      const response = await fetch(this.geoJsonUrl);
      const data = await response.json();
      geoLayer.addData(data); // Add GeoJSON data to the layer
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  }

  private addStationMarkers() {
    if (!this.map) return;

    this.stationData.forEach((station) => {
      if (station.Latitude !== undefined && station.Longitude !== undefined && station.Title) {
        const customIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `
            <div class="station-marker-content">
              <strong>${station.Title}</strong><br>
              Temp: ${station.Temperature} °C<br>
              Humidity: ${station.Humidity} %
            </div>
          `,
          iconSize: [100, 100],
          iconAnchor: [50, 50]
        });

        const marker = L.marker([station.Latitude, station.Longitude], {
          icon: customIcon
        });

        marker.bindPopup(`
          <strong>${station.Title}</strong><br>
          Temperature: ${station.Temperature}°C<br>
          Humidity: ${station.Humidity}%
        `);

        if (this.stationMarkersCluster) {
          this.stationMarkersCluster.addLayer(marker); // Add marker to the cluster group
        }
      }
    });

    // Add the cluster group to the map
    this.map.addLayer(this.stationMarkersCluster);
  }

  private fetchStationData() {
    this.csvDataService.fetchCsvData().subscribe(
      (data: StationData[]) => {
        this.stationData = data;
        this.addStationMarkers();
      },
      (error) => console.error('Error fetching station data:', error)
    );
  }

  public toggleStationMarkers() {
    if (this.stationMarkersVisible) {
      this.stationMarkersCluster.clearLayers();
    } else {
      this.addStationMarkers();
    }
    this.stationMarkersVisible = !this.stationMarkersVisible;
  }

  public togglePngOverlay() {
    if (this.pngOverlayVisible) {
      this.imageOverlay?.remove();
    } else {
      this.addOverlayImage();
    }
    this.pngOverlayVisible = !this.pngOverlayVisible;
  }

  public toggleHeatmapOverlay() {
    if (this.heatmapOverlay) {
      if (this.map && this.map.hasLayer(this.heatmapOverlay)) {
        this.heatmapOverlay.remove();
      } else {
        this.addHeatmapImage();
      }
    }
  }
}
