import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 as UUIDV4 } from 'uuid';
import { JsonPipe } from '@angular/common';
mapboxgl.accessToken = environment.mapboxKey;
interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}
@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.html',
  styleUrl: './markers-page.css',
})
export class MarkersPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);
  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-75.8835186, 4.9036393],
      zoom: 14,
    });

    // const marker = new mapboxgl.Marker({ draggable: true, color: 'green' })
    //   .setLngLat([-75.8835186, 4.9036393])
    //   .addTo(map);
    // marker.on('dragend', () => {
    //   const lngLat = marker.getLngLat();
    //   console.log('Marker dragged to:', lngLat);
    // });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      this.mapClick(event);
    });

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;
    const map = this.map()!;
    // Genera un color aleatorio agradable usando HSL para tonos vibrantes y suaves
    const hue = Math.floor(Math.random() * 360); // cualquier tono
    const saturation = 60 + Math.floor(Math.random() * 20); // 60-80% para colores vivos
    const lightness = 60 + Math.floor(Math.random() * 15); // 60-75% para suavidad
    const alpha = 0.85; // ligeramente translúcido

    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    const coords = event.lngLat;
    const mapboxMarker = new mapboxgl.Marker({
      color,
    })
      .setLngLat(coords)
      .addTo(map);
    const newMarker: Marker = {
      id: UUIDV4(),
      mapboxMarker,
    };
    this.markers.update((markers) => [newMarker, ...markers]);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;
    this.map()!.flyTo({
      center: lngLat,
      zoom: 16,
      speed: 1.2,
      curve: 1,
      easing(t) {
        return t;
      },
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;

    const map = this.map()!;

    marker.mapboxMarker.remove();
    this.markers.update((markers) => {
      return markers.filter((m) => m.id !== marker.id);
    });
  }
}
