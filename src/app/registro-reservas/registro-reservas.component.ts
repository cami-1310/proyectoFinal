import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../firestore.service';

interface tipoHab {
  tipo: string;
  costo: number;
}

@Component({
 selector: 'app-registro-reservas',
  standalone: true,
  imports: [FormsModule, CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-reservas.component.html',
  styleUrl:'./registro-reservas.component.css'
})
export class RegistroReservasComponent {
  reservas: {
    id?: string;
    nombre: string;
    fechaIngreso: string;
    fechaSalida: string;
    tipoHab: tipoHab;
    numPersonas: number;
    editando?: boolean;
    copia?: any;
  }[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    //obtenemos toda la info de la coleccion
    this.firestoreService.getAll('formReservas').subscribe({
      next: data => {
        this.reservas=data;
      }
    });
  }

  editarReserva(reserva: any) {
    reserva.editando = true;
    reserva.copia = { ...reserva};
  }

  guardarEdicion(reserva: any) {
    if (!reserva.id) {
      console.error('No hay ID para actualizar');
      return;
    }

    //especificando qué vamos a guardar en la BD
    const { id, copia, editando, ...dataLimpiada }=reserva;

    this.firestoreService.update('formReservas', reserva.id, dataLimpiada).subscribe({
      next: () => {
        delete reserva.editando;
        delete reserva.copia;
      },
      error: err => {
        console.error('Error al actualizar reserva:', err);
      }
    });
  }

  cancelarEdicion(reserva: any) {
    Object.assign(reserva, reserva.copia);
    delete reserva.editando;
    delete reserva.copia;
  }

  eliminarReserva(index: number) {
    const reserva=this.reservas[index];
    if (!reserva.id) {
      console.error('No hay ID para eliminar');
      return;
    }
    this.firestoreService.delete('formReservas', reserva.id).subscribe({
      next: () => {
        this.reservas.splice(index, 1);
      }
    });
  }
}