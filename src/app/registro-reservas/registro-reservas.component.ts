import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface Reserva {
  nombre: string;
  fechaIngreso: string;
  fechaSalida: string;
  tipoHab: string;
  numPersonas: number;
  editando?: boolean;
}
@Component({
 selector: 'app-registro-reservas',
  standalone: true,
  imports: [FormsModule, CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-reservas.component.html',
  styleUrl:'./registro-reservas.component.css'
})
export class RegistroReservasComponent implements OnInit {
  reservas: Reserva[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('datosReserva');
    this.reservas = data ? JSON.parse(data) : [];
  }

  editarReserva(reserva: Reserva): void {
    reserva.editando = true;
  }

  guardarEdicion(reserva: Reserva): void {
    reserva.editando = false;
    this.actualizarLocalStorage();
  }

  cancelarEdicion(reserva: Reserva): void {
    reserva.editando = false;
    this.ngOnInit(); // Recargar desde localStorage para descartar cambios
  }

  eliminarReserva(index: number): void {
    this.reservas.splice(index, 1);
    this.actualizarLocalStorage();
  }

  private actualizarLocalStorage(): void {
    localStorage.setItem('datosReserva', JSON.stringify(this.reservas));
  }
}
