import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone:true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  //recibira las imagenes desde habitacionSeleccionada
  @Input() imagenes: string[]=[];
  @Input() idCarousel: string='default';
}
