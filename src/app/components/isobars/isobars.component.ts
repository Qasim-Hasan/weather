import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { IsobarDataService } from '../../services/isobar-data.service';

@Component({
  selector: 'app-isobars',
  templateUrl: './isobars.component.html',
  styleUrls: ['./isobars.component.css']
})
export class IsobarsComponent implements OnInit, OnDestroy {
  private map: L.Map | undefined;
  private isobarLayer: L.GeoJSON | undefined;
  private shapefileUrl: string = '../../../assets/world-administrative-boundaries.zip';
  private overlayImageUrl: string = '../../../assets/kriging_isobars.png';
  private intervalId: any;
  private pngUrl: string | undefined; // Variable to store the PNG URL

  constructor(private isobarDataService: IsobarDataService) { }

  ngOnInit() {
    this.initializeMap();
    this.loadIsobarData(); // Call to load isobar data
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeMap() {
    this.map = L.map('map2').setView([30.3753, 69.3451], 4);

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

  private loadIsobarData() {
    this.isobarDataService.getIsobarData().subscribe(
      data => {
        console.log('Fetched isobar data:', data);
        this.pngUrl = data.png_url; // Store the PNG URL

        // Check if bounds exist and is properly structured
        if (data.coordinates && data.coordinates.bounds && Array.isArray(data.coordinates.bounds)) {
          // Create bounds from coordinates
          const bounds = L.latLngBounds(data.coordinates.bounds.map((coord: [number, number]) => L.latLng(coord[1], coord[0])));
          this.addOverlayImage(bounds); // Pass the bounds for the overlay image
          // Inside loadIsobarData, after creating bounds

        } else {
          console.error('Invalid bounds structure:', data.coordinates);
        }
      },
      error => {
        console.error('Error fetching isobar data:', error);
      }
    );
  }


  private addOverlayImage(bounds: L.LatLngBoundsExpression) {
    if (!this.map) return;

    console.log('Adding image overlay with bounds:', bounds);
    L.imageOverlay(this.pngUrl || this.overlayImageUrl, bounds, {
      opacity: 0.6,
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

    this.isobarDataService.getIsobarGeojson().subscribe(
      data => {
        if (this.validateGeoJson(data)) {
          console.log('Fetched isobar data from API:', data);

          this.isobarLayer = L.geoJSON(data, {
            style: {
              color: 'black', // Set a fixed color for all lines
              weight: 2, // Set the weight to make the line bolder
              opacity: 30.0 // Set opacity to fully opaque
            },
            onEachFeature: (feature, layer) => {
              // Since there are no properties, you can skip binding popup or display a default message
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
}

