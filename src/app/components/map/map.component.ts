import { Component, OnInit } from '@angular/core';
import { StationData } from '../../models/station_model';
import { CsvDataService } from '../../services/csv/csv-data.service';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as THREE from 'three'; // Import Three.js

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private geoJsonUrl: string =
    '../../../assets/world-administrative-boundaries1.geojson'; // Updated to GeoJSON
  private pngUrl: string | undefined;
  private heatmapUrl: string | undefined;
  private stationData: StationData[] = [];
  public stationMarkersVisible: boolean = true;
  public pngOverlayVisible: boolean = true;
  private imageOverlay: L.ImageOverlay | undefined;
  private heatmapOverlay: L.ImageOverlay | undefined;
  private stationMarkers: L.Marker[] = [];
  private overlayBounds: L.LatLngBounds | undefined;
  public geoJsonLayerVisible: boolean = true; // Default to visible
  private geoJsonLayer: L.GeoJSON | undefined;
  private scene!: THREE.Scene; // Three.js scene
  private camera!: THREE.PerspectiveCamera; // Camera
  private renderer!: THREE.WebGLRenderer; // Renderer
  private clock = new THREE.Clock(); // For animations
  private windData: any[] = []; // Store wind data

  private stationMarkersCluster: L.MarkerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 160,
  });
  private alwaysVisibleCities: string[] = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Quetta',
  ]; // Replace with your city names
  public selectedImageType: string = 'isobar'; // Default value
  constructor(
    private csvDataService: CsvDataService,
    private isobarImageDataService: IsobarImageDataService
  ) {}

  ngOnInit() {
    //   window.addEventListener('resize', this.onWindowResize.bind(this), false);
    //  this.initializeThreeJS(); // Initialize Three.js
    //  this.loadVelocityData(); // Load velocity data
    //  this.animate(); // Start the animation loop
    this.initializeMap();
    this.loadIsobarData(); // You can specify the image type here
    this.fetchStationData();
    setInterval(() => {
      this.refreshMap();
    }, 600000); // 600000 ms = 10 minutes
  }

  private refreshMap() {
    console.log('Refreshing map data...');
    this.fetchStationData();
    this.loadIsobarData();
  }

  private initializeMap() {
    this.map = L.map('map2', {
      center: [30.3753, 69.3451],
      zoom: 6,
      minZoom: 4,
      maxZoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 15,
      minZoom: 1,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 1,
      noWrap: true,
    }).addTo(this.map);

    this.addGeoJsonLayer(); // Change method call to load GeoJSON
  }

  public loadIsobarData() {
    const imageType = this.selectedImageType; // Use the selected image type
    this.isobarImageDataService.getIsobarData(imageType).subscribe(
      (data) => {
        this.pngUrl = data.layer_image_url;
        this.heatmapUrl = data.heatmap_image_url;

        if (
          data.coordinates &&
          data.coordinates.bounds &&
          Array.isArray(data.coordinates.bounds)
        ) {
          this.overlayBounds = L.latLngBounds(
            data.coordinates.bounds.map((coord: [number, number]) =>
              L.latLng(coord[1], coord[0])
            )
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
      interactive: true,
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
      interactive: true,
    }).addTo(this.map);
  }

  private addGeoJsonLayer() {
    this.updateGeoJsonLayer(); // Call the updated method to load GeoJSON
  }

  private async updateGeoJsonLayer() {
    if (!this.map) return;

    // Remove existing GeoJSON layer if it exists
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
    }

    this.geoJsonLayer = L.geoJSON(null, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const properties = Object.keys(feature.properties)
            .map((key) => `${key}: ${feature.properties[key]}`)
            .join('<br />');
          layer.bindPopup(properties);
        }
      },
    }).addTo(this.map);

    try {
      const response = await fetch(this.geoJsonUrl);
      const data = await response.json();

      console.log('GeoJSON data:', data); // Debugging: Check if data is loaded
      this.geoJsonLayer.addData(data); // Add GeoJSON data to the layer
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  }

  private addStationMarkers() {
    if (!this.map) return;

    // Clear the marker cluster before adding new markers
    this.stationMarkersCluster.clearLayers();

    this.stationData.forEach((station) => {
      if (station.Latitude !== undefined && station.Longitude !== undefined) {
        const imageUrl1 = `assets/station/high_cloud/${station.High_cloud}.png`;
        const imageUrl2 = `assets/station/low_cloud/${station.Low_cloud}.png`;
        const imageUrl3 = `assets/station/mid_cloud/${station.Mid_cloud}.png`;
        const imageUrl4 = `assets/station/sky_cover/${station.Sky_cover}.png`;
        const imageUrl5 = `assets/station/wind_barbs/${station.windSpeed_windDirection}.png`;
        const customIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `
        <div class="station-marker-content" style="font-size: 11px; position: relative; width: 90px; height: 90px; display: flex; flex-direction: column; align-items: center;">
          <div style="position: absolute; top: 0; left: 10; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;">
            <img src="${imageUrl1}" class="station-image" style="width: 60px; height: 60px;">
            <img src="${imageUrl2}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            <img src="${imageUrl3}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            <img src="${imageUrl4}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            <img src="${imageUrl5}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            </div>
<div style="display: flex; justify-content: space-between; width: 100%; margin-top: 5px; padding: 0 5px;">
  <div style="font-size: 10px; color: blue; padding-right: 10px;">${station.Temperature.toFixed(1)}°C</div>
  <div style="font-size: 10px; color: green; padding-left: 10px;">${station.Humidity.toFixed(1)}%</div>
</div>
          <strong style="margin-top: 35px; text-align: center; font-size: 10px;">${
            station.Title
          }</strong> <!-- Title centered below images -->
        </div>
      `,

          iconSize: [100, 100], // Adjusted icon size for better fitting
          iconAnchor: [40, 80], // Anchor point for the icon
        });

        const marker = L.marker([station.Latitude, station.Longitude], {
          icon: customIcon,
        });

        marker.bindPopup( `
          <div class="station-marker-content" style="font-size: 11px; position: relative; width: 90px; height: 90px; display: flex; flex-direction: column; align-items: center;">
            <div style="position: absolute; top: 0; left: 10; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;">
              <img src="${imageUrl1}" class="station-image" style="width: 60px; height: 60px;">
              <img src="${imageUrl2}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl3}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl4}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl5}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              </div>
  <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 5px; padding: 0 5px;">
    <div style="font-size: 10px; color: blue; padding-right: 10px;">${station.Temperature.toFixed(1)}°C</div>
    <div style="font-size: 10px; color: green; padding-left: 10px;">${station.Humidity.toFixed(1)}%</div>
  </div>
            <strong style="margin-top: 35px; text-align: center; font-size: 10px;">${
              station.Title
            }</strong> <!-- Title centered below images -->
          </div>`);

        // Check if the station is one of the always visible cities
        if (this.alwaysVisibleCities.includes(station.Title)) {
          marker.addTo(this.map!); // Add directly to the map
        } else {
          this.stationMarkersCluster.addLayer(marker); // Add to the cluster
        }
      }
    });

    // Add the cluster group to the map if there are any markers
    if (this.stationMarkersCluster.getLayers().length > 0) {
      this.map.addLayer(this.stationMarkersCluster);
    }
  }

  public toggleStationMarkers() {
    if (this.stationMarkersVisible) {
      // Clear all markers, including those for always visible cities
      this.stationMarkersCluster.clearLayers();
      this.map?.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });
    } else {
      // Re-add all markers, including those for always visible cities
      this.addStationMarkers();
    }
    this.stationMarkersVisible = !this.stationMarkersVisible;
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
  public toggleGeoJsonLayer() {
    if (this.geoJsonLayerVisible) {
      // Remove the GeoJSON layer
      if (this.geoJsonLayer) {
        this.map?.removeLayer(this.geoJsonLayer);
      }
    } else {
      // Add the GeoJSON layer
      this.updateGeoJsonLayer(); // Call your existing method to load the GeoJSON
    }
    this.geoJsonLayerVisible = !this.geoJsonLayerVisible; // Toggle the visibility state
  }
}

/*
  private onWindowResize() {
    if (this.camera) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
}
  private initializeThreeJS() {
    // Set up the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('map2')?.appendChild(this.renderer.domElement); // Append to the DOM

    this.camera.position.z = 15; // Move the camera back

  }
  private createSimpleGeometry() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube); // Add cube to the scene
}



  private createWindParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    // Define a conversion function to map latitude/longitude to 3D space
    const geoToThree = (latitude: number, longitude: number) => {
        const scaleFactor = 100000; // Adjust this scale factor as needed for visibility
        const x = (longitude - 67.0) * scaleFactor; // Adjusting for the longitude offset
        const y = (latitude - 30.0) * scaleFactor; // Adjusting for the latitude offset
        return [x, y, 0]; // Assuming height (z) is 0 for a flat representation
    };

    // Convert wind data into particles
    this.windData.forEach(data => {
        const [u, v] = data.velocity; // Wind velocity components
        const [longitude, latitude] = data.coordinates; // Coordinates
        const position = geoToThree(latitude, longitude); // Convert to Three.js coordinates
        vertices.push(...position);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create a point material for the particles
    const material = new THREE.PointsMaterial({
        size: 5,
        color: 0x00ff00, // Green color for wind particles
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles); // Add particles to the scene
}



private animate() {
  requestAnimationFrame(() => this.animate()); // Request the next frame
  const delta = this.clock.getDelta(); // Get time difference
  console.log("Animating..."); // Log to see if it's being called
  // Update particle positions based on wind velocity (simple movement example)
  this.windData.forEach((data, index) => {
      const [u, v] = data.velocity;
      const particle = this.scene.children[index]; // Assuming each particle corresponds to the index
      if (particle instanceof THREE.Points) {
          particle.position.x += u * delta; // Adjust for wind speed
          particle.position.y += v * delta; // Adjust for wind speed
      }
  });

  this.renderer.render(this.scene, this.camera); // Render the Three.js scene

}

private createWindPath() {
  // Coordinates for Karachi and Lahore
  const karachi = new THREE.Vector3(67.0822, 24.8607, 0); // Karachi
  const lahore = new THREE.Vector3(74.3587, 31.5204, 0); // Lahore

  // Create a geometry for the line
  const geometry = new THREE.BufferGeometry().setFromPoints([karachi, lahore]);

  // Create a material for the line
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 }); // Blue line

  // Create the line object
  const line = new THREE.Line(geometry, material);

  // Add the line to the scene
  this.scene.add(line);
}

// Call createWindPath in your loadVelocityData method or after initializing the scene
private loadVelocityData() {
  this.windData = this.getHardcodedWindData(); // Get hardcoded wind data
  this.createWindParticles(); // Create particles from wind data
  this.createWindPath(); // Create a line from Karachi to Lahore
}


  private getHardcodedWindData() {
    // Hardcoded wind velocity data for various locations in Pakistan
    return [
      {
        velocity: [5, 2], // Wind velocity (u-component, v-component) for Karachi
        coordinates: [67.0822, 24.8607], // Karachi
      },
      {
        velocity: [3, 1], // Wind velocity for Lahore
        coordinates: [74.3587, 31.5204], // Lahore
      },
      {
        velocity: [4, 2], // Wind velocity for Islamabad
        coordinates: [73.0551, 33.6844], // Islamabad
      },
      {
        velocity: [2, 3], // Wind velocity for Quetta
        coordinates: [66.9750, 30.1798], // Quetta
      },
      {
        velocity: [1, 4], // Wind velocity for Peshawar
        coordinates: [71.5249, 34.0150], // Peshawar
      },
      {
        velocity: [6, 2], // Wind velocity for Multan
        coordinates: [71.5249, 30.1575], // Multan
      },
      {
        velocity: [2, 5], // Wind velocity for Faisalabad
        coordinates: [73.1350, 31.5204], // Faisalabad
      },
      {
        velocity: [3, 3], // Wind velocity for Sialkot
        coordinates: [74.5479, 32.5132], // Sialkot
      },
    ];
  }
*/
