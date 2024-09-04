import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-isohyets',
  templateUrl: './isohyets.component.html',
  styleUrls: ['./isohyets.component.css']
})
export class IsohyetsComponent implements OnInit, OnDestroy {
  private map: mapboxgl.Map | undefined;
  private isohyetDataUrl: string = 'assets/isonephs.geojson'; // Ensure correct path
  style = 'mapbox://styles/mapbox/light-v10';
  lat: number = 30.3753; // Latitude for Pakistan
  lng: number = 69.3451; // Longitude for Pakistan

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxAccessToken;
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map4', // The ID of the HTML element that will contain the map
      style: this.style,
      center: [this.lng, this.lat],
      zoom: 5, // Adjust zoom level to show more of Pakistan
    });

    this.map.on('load', () => {
      if (this.map) {
        this.addIsohyetsLayer();
      }
    });

    this.map.on('click', this.onMapClick.bind(this));

    // Optional: Handle any loading errors
    this.map.on('error', (error) => {
      console.error('Map loading error:', error);
    });
  }

  private addIsohyetsLayer() {
    if (this.map) {
      // Add the GeoJSON data as a source
      this.map.addSource('isohyets', {
        type: 'geojson',
        data: this.isohyetDataUrl
      });

      // Add a fill layer to visualize the isohyets
      this.map.addLayer({
        id: 'isohyets-layer',
        type: 'fill',
        source: 'isohyets',
        layout: {},
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'precipitation'],
            0, '#0000ff', // Blue for low precipitation
            200, '#ff0000' // Red for high precipitation
          ],
          'fill-opacity': 0.5
        }
      });

      // Optionally add a line layer to outline the isohyets
      this.map.addLayer({
        id: 'isohyets-outline',
        type: 'line',
        source: 'isohyets',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 2
        }
      });
    }
  }

  onMapClick(event: mapboxgl.MapMouseEvent) {
    console.log('Map clicked at', event.lngLat);
  }
}

























/*

import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl, { MapMouseEvent } from 'mapbox-gl'; // Importing MapMouseEvent directly

@Component({
  selector: 'app-isohyets',
  templateUrl: './isohyets.component.html',
  styleUrls: ['./isohyets.component.css']
})
export class IsohyetsComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map | undefined; // Use mapboxgl.Map type
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 30.2672;
  lng: number = -97.7431;

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxAccessToken; // Use environment variable

    this.map = new mapboxgl.Map({
      container: 'map4', // Ensure this matches your HTML
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.map.on('click', this.onMapClick.bind(this)); // Bind this context for event handling
  }

  onMapClick(event: MapMouseEvent) { // Use the imported MapMouseEvent type
    console.log('Map clicked at', event.lngLat);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}



  /*
  private map!: Map; // Define the map variable using the correct type
  private deckOverlay!: MapboxOverlay; // Declare deckOverlay with the correct type
  private isohyetDataUrl: string = '../../../assets/isohyets.geojson';

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove(); // Cleanup on component destroy
    }
  }

  private initializeMap() {
    mapboxgl.accessToken = 'YOUR_ACTUAL_MAPBOX_ACCESS_TOKEN'; // Set your Mapbox access token

    const options: MapboxOptions = {
      container: 'map4', // Ensure your HTML contains a div with this ID
      style: 'mapbox://styles/mapbox/light-v10',
      center: [69.3451, 30.3753],
      zoom: 4,
      pitch: 45,
      bearing: 0,
      antialias: true
    };

    this.map = new mapboxgl.Map(options); // Create the map instance

    this.map.on('load', () => {
      this.map.addSource('terrain-data', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14
      });

      this.map.setTerrain({ source: 'terrain-data', exaggeration: 1.5 });

      // Create Deck.gl overlay
      this.deckOverlay = new MapboxOverlay({
        layers: [this.createGeoJsonLayer()]
      });

      // Set the deck overlay to the map
      this.deckOverlay.setMap(this.map);
    });
  }

  private createGeoJsonLayer() {
    return new GeoJsonLayer({
      id: 'isohyets-layer',
      data: this.isohyetDataUrl,
      filled: true,
      extruded: true,
      getElevation: (d) => d.properties.precipitation || 0,
      getFillColor: (d) => this.getIsohyetColor(d.properties.precipitation),
      pickable: true,
      autoHighlight: true,
      onClick: (info) => console.log(info),
      opacity: 0.8
    });
  }

  private getIsohyetColor(precipitation: number): [number, number, number, number] {
    if (precipitation > 200) return [255, 0, 0, 255]; // Example color for high precipitation
    return [0, 0, 255, 255]; // Example color for low precipitation
  }
  */
