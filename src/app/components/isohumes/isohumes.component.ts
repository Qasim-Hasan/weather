import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-isohumes',
  templateUrl: './isohumes.component.html',
  styleUrls: ['./isohumes.component.css']
})
export class IsohumesComponent implements OnInit  {
  private map: L.Map | undefined;
  private isohumeLayer: L.GeoJSON | undefined;
  private isohumeDataUrl: string = '../../../assets/isohumes.geojson';
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = L.map('map3').setView([30.3753, 69.3451], 4); // Centered on Pakistan, zoom level 6

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 1,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 0.5,
      noWrap: true
    }).addTo(this.map);

    this.addShapefileLayer();
    this.addIsohumeLayer();
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

  private addIsohumeLayer() {
    this.updateIsohumeLayer();
    this.startIsohumeAnimation();
  }

  private updateIsohumeLayer() {
    if (!this.map) return;

    if (this.isohumeLayer) {
      this.map.removeLayer(this.isohumeLayer);
    }

    fetch(this.isohumeDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isohume data:', data);
          this.isohumeLayer = L.geoJSON(data, {
            style: (feature) => this.getIsohumeStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(`Humidity: ${feature.properties.humidity}%`);
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isohume GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching isohume data:', error);
      });
  }

  private getIsohumeStyle(feature: any): L.PathOptions {
    const humidity = feature.properties.humidity || 0;
    let fillColor = 'rgba(255, 255, 255, 0.5)'; // Default color

    if (humidity > 80) {
      fillColor = 'rgba(0, 128, 0, 0.5)'; // Dark green for very high humidity
    } else if (humidity > 60) {
      fillColor = 'rgba(34, 139, 34, 0.5)'; // Forest green for high humidity
    } else if (humidity > 40) {
      fillColor = 'rgba(50, 205, 50, 0.5)'; // Lime green for moderate humidity
    } else if (humidity > 20) {
      fillColor = 'rgba(144, 238, 144, 0.5)'; // Light green for low humidity
    } else {
      fillColor = 'rgba(240, 255, 240, 0.5)'; // Honeydew for very low humidity
    }

    return {
      fillColor: fillColor,
      weight: 2, // Thinner lines for a distinct visual style
      opacity: 0.8, // Slightly less opaque than other layers
      color: 'green', // Line color
      dashArray: '5, 5', // Dashed lines for distinctiveness
      fillOpacity: 0.6
    };
  }

  private startIsohumeAnimation() {
    setInterval(() => this.updateIsohumeLayer(), 5000);
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }
}
