import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-isohyets',
  templateUrl: './isohyets.component.html',
  styleUrls: ['./isohyets.component.css']
})
export class IsohyetsComponent {
  private map: L.Map | undefined;
  private isohyetLayer: L.GeoJSON | undefined;
  private isohyetDataUrl: string = '../../../assets/isohyets.geojson';
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';
  private updateIntervalId: any;
  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }
  private initializeMap() {
    this.map = L.map('map4').setView([30.3753, 69.3451], 4); // Centered on Pakistan, zoom level 4

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
    this.addIsohyetLayer();
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

  private addIsohyetLayer() {
    this.updateIsohyetLayer();
    this.startIsohyetAnimation();
  }

  private updateIsohyetLayer() {
    if (!this.map) return;

    if (this.isohyetLayer) {
      this.map.removeLayer(this.isohyetLayer);
    }

    fetch(this.isohyetDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isohyet data:', data);
          this.isohyetLayer = L.geoJSON(data, {
            style: (feature) => this.getIsohyetStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(`Precipitation: ${feature.properties.precipitation} mm`);
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid isohyet GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching isohyet data:', error);
      });
  }

  private getIsohyetStyle(feature: any): L.PathOptions {
    const precipitation = feature.properties.precipitation || 0;
    let fillColor = 'rgba(255, 255, 255, 0.5)'; // Default color

    if (precipitation > 200) {
      fillColor = 'rgba(0, 0, 255, 0.5)'; // Blue for very high precipitation
    } else if (precipitation > 150) {
      fillColor = 'rgba(70, 130, 180, 0.5)'; // Steel blue for high precipitation
    } else if (precipitation > 100) {
      fillColor = 'rgba(100, 149, 237, 0.5)'; // Cornflower blue for moderate precipitation
    } else if (precipitation > 50) {
      fillColor = 'rgba(135, 206, 250, 0.5)'; // Light sky blue for low precipitation
    } else {
      fillColor = 'rgba(173, 216, 230, 0.5)'; // Light blue for very low precipitation
    }

    return {
      fillColor: fillColor,
      weight: 5, // Increased weight for bolder lines
      opacity: 0.9, // Full opacity for lines
      color: 'blue', // Line color
      dashArray: '2, 6', // Dashed lines for distinctiveness
      fillOpacity: 0.6
    };
  }


  private startIsohyetAnimation() {
    // Store the interval ID so it can be cleared later
    this.updateIntervalId = setInterval(() => this.updateIsohyetLayer(), 5000);
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }
}
