import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegistroComentariosComponent } from '../registro-comentarios/registro-comentarios.component';
import { RegistroReservasComponent } from '../registro-reservas/registro-reservas.component';
import { GraficaComponent } from '../grafica/grafica.component';
import { signal } from '@angular/core';
@Component({
  selector: 'app-switch-local',
  standalone:true,
  imports: [CommonModule, RegistroComentariosComponent,RegistroReservasComponent,GraficaComponent],
  templateUrl: './switch-local.component.html',
  styleUrl: './switch-local.component.css'
})
export class SwitchLocalComponent {
  vista=signal<'reservas'|'comentarios'>('reservas')

  cambiarVista(v:'reservas'|'comentarios') {
    this.vista.set(v);
  }
}

//otro cambio