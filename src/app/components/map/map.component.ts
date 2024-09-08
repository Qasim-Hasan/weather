import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { StationData } from '../../models/station_model';
import { CsvDataService } from '../../services/csv/csv-data.service';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

 /*
  private map: L.Map | undefined;
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';
  private pngUrl: string | undefined;
  private stationData: StationData[] = [];
  public stationMarkersVisible: boolean = true;
  public pngOverlayVisible: boolean = true;
  private imageOverlay: L.ImageOverlay | undefined;
  private stationMarkers: L.Marker[] = [];
  private overlayBounds: L.LatLngBounds | undefined;

  // Initialize stationMarkersCluster to avoid undefined issues
  private stationMarkersCluster: L.MarkerClusterGroup = L.markerClusterGroup();

  constructor(
    private csvDataService: CsvDataService,
    private isobarImageDataService: IsobarImageDataService
  ) {}

  ngOnInit() {
    this.initializeMap();
    this.loadIsobarData();
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
      opacity: 0.5,
      noWrap: true
    }).addTo(this.map);

    this.addShapefileLayer();
  }

  private loadIsobarData() {
    this.isobarImageDataService.getIsobarData().subscribe((data) => {
      this.pngUrl = data.png_url;
      if (data.coordinates && data.coordinates.bounds && Array.isArray(data.coordinates.bounds)) {
        this.overlayBounds = L.latLngBounds(
          data.coordinates.bounds.map((coord: [number, number]) => L.latLng(coord[1], coord[0]))
        );
        this.addOverlayImage();
      }
    });
  }

  private addOverlayImage() {
    if (!this.map || !this.pngUrl || !this.overlayBounds) return;

    if (this.imageOverlay) {
      this.imageOverlay.remove();
    }

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
            .join('<br />');
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

  toggleStationMarkers() {
    if (this.stationMarkersVisible) {
      this.stationMarkersCluster.clearLayers();
    } else {
      this.addStationMarkers();
    }
    this.stationMarkersVisible = !this.stationMarkersVisible;
  }

  togglePngOverlay() {
    if (this.pngOverlayVisible) {
      this.imageOverlay?.remove();
    } else {
      this.addOverlayImage();
    }
    this.pngOverlayVisible = !this.pngOverlayVisible;
  }
}
*/
}
