import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Location } from '../../models/location.model';
import 'mapbox-gl/dist/mapbox-gl.css';

@Component({
  selector: 'app-map-box',
  imports: [],
  templateUrl: './map-box.component.html',
  styleUrl: './map-box.component.scss',
})
export class MapBoxComponent implements AfterViewInit {
  @ViewChild('mapContainer') private mapContainer!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) locations: Location[] = [];
  MAPBOX_TOKEN =
    'pk.eyJ1IjoicGVyaWNhYjM1IiwiYSI6ImNtZDB3bDh5NTB0YmYyanFuZjM1cjR6MG4ifQ.Yu9Lb17GEXTFTB_5k5A9nA';

  async ngAfterViewInit(): Promise<void> {
    // Dynamically import mapbox-gl for SSR safety and to ensure mapboxgl is available
    const mapboxgl = (await import('mapbox-gl')).default;
    mapboxgl.accessToken = this.MAPBOX_TOKEN;
    const mapInstance = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/pericab35/cmd0xcb9j009301s9fh3w0k74',
      scrollZoom: false,
      doubleClickZoom: false,
      // center: props.locations[0].coordinates,
      // zoom: 7
      // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();
    // Add markers for each location
    this.locations.forEach((loc) => {
      //Add marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Add popup
      const popup = new mapboxgl.Popup({
        offset: 30,
        focusAfterOpen: false,
        closeOnClick: false,
      })
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .setLngLat(loc.coordinates)
        .addTo(mapInstance);

      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(mapInstance)
        .setPopup(popup);

      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });

    const lineCoordinates = this.locations.map((loc) => loc.coordinates);

    mapInstance!.on('load', () => {
      mapInstance?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: lineCoordinates,
          },
          properties: [],
        },
      });

      mapInstance?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#8001c6',
          'line-width': 4,
        },
      });
    });

    mapInstance?.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  }
}
