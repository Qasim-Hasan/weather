import { Component , OnInit} from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-gis',
  templateUrl: './gis.component.html',
  styleUrls: ['./gis.component.css']
})
export class GisComponent implements OnInit{
  private map: L.Map | undefined;
  private geoJsonLayer: L.GeoJSON | undefined;
  private additionalGeoJsonLayer: L.GeoJSON | undefined;
  private geoJsonDataUrl: string = '../../../assets/asia_only.geojson'; // Asia map GeoJSON file URL
  private additionalGeoJsonDataUrl: string = '../../../assets/gis_osm_landuse_a_free_1.geojson'; // Additional GIS GeoJSON file URL

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    if (this.map) {
      this.map.remove(); // Remove existing map instance if it exists
    }

    // Create a Leaflet map
    this.map = L.map('map', {
      zoomControl: true, // Enable zoom controls
      scrollWheelZoom: true, // Enable zoom with mouse wheel
      dragging: true, // Enable dragging
      touchZoom: true, // Enable touch zoom
      doubleClickZoom: true, // Enable double click zoom
      boxZoom: true // Enable box zoom
    }).setView([0, 0], 2); // Center the map globally

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 1,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 0.5,
      noWrap: true
    }).addTo(this.map);

    // Add GeoJSON layers after the map is initialized
    this.addGeoJsonLayer();
    this.addAdditionalGeoJsonLayer();
  }


  private addGeoJsonLayer() {
    if (!this.map) return;

    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
    }

    fetch(this.geoJsonDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched Asia GeoJSON data:', data);
          this.geoJsonLayer = L.geoJSON(data, {
            style: (feature) => this.getGeoJsonStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(this.createPopupContent(feature));
              }
            }
          }).addTo(this.map!);

          // Safely call fitBounds using optional chaining
          this.map?.fitBounds(this.geoJsonLayer?.getBounds());
        } else {
          console.error('Invalid GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching GeoJSON data:', error);
      });
  }

  private addAdditionalGeoJsonLayer() {
    if (!this.map) return;

    if (this.additionalGeoJsonLayer) {
      this.map.removeLayer(this.additionalGeoJsonLayer);
    }

    fetch(this.additionalGeoJsonDataUrl)
      .then(response => response.json())
      .then((data: any) => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched additional GeoJSON data:', data);
          this.additionalGeoJsonLayer = L.geoJSON(data, {
            style: (feature) => this.getAdditionalGeoJsonStyle(feature),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(this.createPopupContent(feature));
              }
            }
          }).addTo(this.map!);
        } else {
          console.error('Invalid additional GeoJSON data:', data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching additional GeoJSON data:', error);
      });
  }

  private getGeoJsonStyle(feature: any): L.PathOptions {
    // Style the Asia map layer with a light blue color
    return {
      color: 'lightblue',
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.3
    };
  }

  private getAdditionalGeoJsonStyle(feature: any): L.PathOptions {
    // Define style for additional GIS data (customize as needed)
    return {
      color: feature.properties.color || 'green',
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.5
    };
  }

  private createPopupContent(feature: any): string {
    // Create a popup content string from feature properties
    return Object.keys(feature.properties).map(key => `${key}: ${feature.properties[key]}`).join("<br />");
  }

  private validateGeoJson(data: any): boolean {
    return data && data.type === 'FeatureCollection' && Array.isArray(data.features);
  }
}
