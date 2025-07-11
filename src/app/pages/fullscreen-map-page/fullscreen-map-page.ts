import { AfterViewInit, Component, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;
@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.html',
  styleUrl: './fullscreen-map-page.css',
})
export class FullscreenMapPage implements AfterViewInit {
  divElement = viewChild('map');

  async ngAfterViewInit() {
    if (!this.divElement()) return;
const element = this.divElement().nativeElement;
    const map = new mapboxgl.Map({
      container: this.divElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
  }
}
