import { Component,OnInit} from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-isotherm',
  templateUrl: './isotherm.component.html',
  styleUrls: ['./isotherm.component.css']
})
export class IsothermComponent implements OnInit {
  private map: L.Map | undefined;
  private isothermLayer: L.GeoJSON | undefined;
  private isothermDataUrl: string = '../../../assets/isotherms.geojson';
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';

  ngOnInit() {
    this.initializeMap();
  }
  private initializeMap() {
    this.map = L.map('map1').setView([30.3753, 69.3451], 4); // Centered on Pakistan, zoom level 6

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
    this.addIsothermLayer();
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
  private addIsothermLayer() {
    this.updateIsothermLayer();
    this.startIsothermAnimation();
  }

  private updateIsothermLayer() {
    if (!this.map) return;

    if (this.isothermLayer) {
      this.map.removeLayer(this.isothermLayer);
    }

    fetch(this.isothermDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isotherm data:', data);
          this.isothermLayer = L.geoJSON(data, {
            style: (feature) => this.getIsothermStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(`Temperature: ${feature.properties.temperature}°C`);
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isotherm GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching isotherm data:', error);
      });
  }

  private getIsothermStyle(feature: any): L.PathOptions {
    const temperature = feature.properties.temperature || 0;
    let fillColor = 'rgba(255, 255, 255, 0.5)'; // Default color

    if (temperature > 30) {
      fillColor = 'rgba(255, 0, 0, 0.5)'; // Red for high temperatures
    } else if (temperature > 20) {
      fillColor = 'rgba(255, 165, 0, 0.5)'; // Orange for moderate temperatures
    } else {
      fillColor = 'rgba(255, 255, 0, 0.5)'; // Yellow for low temperatures
    }

    return {
      fillColor: fillColor,
      weight: 3, // Increased weight for bold lines
      opacity: 1, // Full opacity for lines
      color: 'orange', // Line color
      dashArray: '', // Solid lines
      fillOpacity: 0.7
    };
  }

  private startIsothermAnimation() {
    setInterval(() => this.updateIsothermLayer(), 5000);
  }
  // Validate GeoJSON data
  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }


}
