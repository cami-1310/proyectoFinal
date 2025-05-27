import { Component, ViewChild, ElementRef } from '@angular/core';
import { Habitaciones } from '../habitaciones';
import { Habitacion } from '../habitacion';
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-habitaciones',
  standalone:true,
  imports: [CarouselComponent, RouterModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {
  habitaciones: Habitacion[]=Habitaciones;
  habitacionSeleccionada?: Habitacion;
  indiceHabitacion?: number;
  modal: any;

  openModal(habitacion: Habitacion, index: number) {
    this.habitacionSeleccionada=habitacion;
    this.indiceHabitacion=index;

    this.modal = new (window as any).bootstrap.Modal(document.getElementById('contModal')!);
    this.modal.show();
  }

  closeModal(){
    this.modal.hide();
  }
}