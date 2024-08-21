import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-isobars',
  templateUrl: './isobars.component.html',
  styleUrls: ['./isobars.component.css']
})
export class IsobarsComponent implements OnInit{
  private map: L.Map | undefined;
  private isobarLayer: L.GeoJSON | undefined;
  private isobarDataUrl: string = '../../../assets/isobars.geojson';
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = L.map('map2').setView([30.3753, 69.3451], 4); // Centered on Pakistan, zoom level 6

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
    this.addIsobarLayer();
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

  private addIsobarLayer() {
    this.updateIsobarLayer();
    this.startIsobarAnimation();
  }

  private updateIsobarLayer() {
    if (!this.map) return;

    if (this.isobarLayer) {
      this.map.removeLayer(this.isobarLayer);
    }

    fetch(this.isobarDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isobar data:', data);
          this.isobarLayer = L.geoJSON(data, {
            style: (feature) => this.getIsobarStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(`Pressure: ${feature.properties.pressure} hPa`);
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isobar GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching isobar data:', error);
      });
  }

  private getIsobarStyle(feature: any): L.PathOptions {
    const pressure = feature.properties.pressure || 0;
    let fillColor = 'rgba(0, 0, 255, 0.5)'; // Default color

    if (pressure > 1020) {
      fillColor = 'rgba(0, 0, 255, 0.5)'; // Blue for high pressure
    } else if (pressure > 1010) {
      fillColor = 'rgba(173, 216, 230, 0.5)'; // Light blue for moderate pressure
    } else {
      fillColor = 'rgba(135, 206, 235, 0.5)'; // Sky blue for low pressure
    }

    return {
      fillColor: fillColor,
      weight: 3, // Increased weight for bold lines
      opacity: 1, // Full opacity for lines
      color: 'blue', // Line color
      dashArray: '', // Solid lines
      fillOpacity: 0.7
    };
  }

  private startIsobarAnimation() {
    setInterval(() => this.updateIsobarLayer(), 5000);
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }
}
