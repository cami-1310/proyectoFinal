import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegistroComentariosComponent } from '../registro-comentarios/registro-comentarios.component';
import { RegistroReservasComponent } from '../registro-reservas/registro-reservas.component';

@Component({
  selector: 'app-switch-local',
  standalone:true,
  imports: [CommonModule, RegistroComentariosComponent,RegistroReservasComponent],
  templateUrl: './switch-local.component.html',
  styleUrl: './switch-local.component.css'
})
export class SwitchLocalComponent {
  vista: 'reservas' | 'comentarios' = 'reservas';

  cambiarVista(vista: 'reservas' | 'comentarios') {
    this.vista = vista;
  }

}
