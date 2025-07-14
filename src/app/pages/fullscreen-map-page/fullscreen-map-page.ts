import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl, { ScaleControl } from 'mapbox-gl';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;
@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.html',
  styleUrl: './fullscreen-map-page.css',
})
export class FullscreenMapPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);
  coordinates = signal({
    lng: -75.6892359,
    lat: 4.8051041,
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;
    const { lat, lng } = this.coordinates();
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: this.zoom(),
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });
    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new ScaleControl(), 'bottom-left');
    this.map.set(map);
  }
}
