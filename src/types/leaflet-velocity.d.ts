import * as L from 'leaflet';

// src/@types/leaflet-velocity.d.ts
declare module 'leaflet' {
  interface VelocityData {
    type: string;
    features: Array<{
      type: string;
      properties: {
        velocity: [number, number]; // u-component and v-component
      };
      geometry: {
        type: string;
        coordinates: [number, number]; // Longitude, Latitude
      };
    }>;
  }

  export function velocityLayer(options: any): any;
}
