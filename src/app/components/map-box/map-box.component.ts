import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Location } from '../../models/location.model';
import 'mapbox-gl/dist/mapbox-gl.css';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') private mapContainer!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) locations: Location[] = [];

  MAPBOX_TOKEN =
    'pk.eyJ1IjoicGVyaWNhYjM1IiwiYSI6ImNtZDB3bDh5NTB0YmYyanFuZjM1cjR6MG4ifQ.Yu9Lb17GEXTFTB_5k5A9nA';

  private mapInstance!: any;
  private markers: any[] = [];

  async ngAfterViewInit(): Promise<void> {
    // Dynamically import mapbox-gl
    const mapboxgl = (await import('mapbox-gl')).default;
    // Assign to window so other functions can access
    (window as any).mapboxgl = mapboxgl;

    mapboxgl.accessToken = this.MAPBOX_TOKEN;

    // Initialize map once
    this.mapInstance = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/pericab35/cmfb29hfx004401sj73nj9d1j',
      scrollZoom: false,
      doubleClickZoom: false,
    });

    // Wait for map to fully load
    this.mapInstance.on('load', () => {
      this.updateMarkersAndRoute();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locations'] && this.mapInstance && this.mapInstance.loaded()) {
      this.updateMarkersAndRoute();
    }
  }

  private updateMarkersAndRoute(): void {
    const mapboxgl = (window as any).mapboxgl;
    if (!this.mapInstance || !mapboxgl) return;

    // Remove existing markers
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Remove old route if exists
    if (this.mapInstance.getLayer('route'))
      this.mapInstance.removeLayer('route');
    if (this.mapInstance.getSource('route'))
      this.mapInstance.removeSource('route');

    const bounds = new mapboxgl.LngLatBounds();

    // Add markers and popups
    this.locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'marker';

      const popup = new mapboxgl.Popup({
        offset: 30,
        focusAfterOpen: false,
        closeOnClick: false,
      }).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(loc.coordinates)
        .setPopup(popup)
        .addTo(this.mapInstance);

      popup.addTo(this.mapInstance); // open popup immediately
      this.markers.push(marker);

      bounds.extend(loc.coordinates);
    });

    const lineCoordinates = this.locations.map((loc) => loc.coordinates);

    if (lineCoordinates.length) {
      this.mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: lineCoordinates },
          properties: {},
        },
      });

      this.mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#8001c6', 'line-width': 4 },
      });
    }

    // Fit map bounds
    if (this.locations.length) {
      this.mapInstance.fitBounds(bounds, {
        padding: { top: 200, bottom: 150, left: 100, right: 100 },
      });
    }
  }
}
