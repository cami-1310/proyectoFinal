import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../firestore.service';
import { LoadingService } from '../loading.service';
import { CargandoComponent } from '../cargando/cargando.component';

interface tipoHab {
  tipo: string;
  costo: number;
}

@Component({
  selector: 'app-registro-reservas',
  standalone: true,
  imports: [
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './registro-reservas.component.html',
  styleUrls: ['./registro-reservas.component.css']
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

  constructor(
    private firestoreService: FirestoreService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show();

    this.firestoreService.getAll('formReservas').subscribe({
      next: data => {
        this.reservas = data;
        this.loadingService.hide();
      },
      error: err => {
        console.error('Error al obtener datos:', err);
        this.loadingService.hide(); // también ocultamos en caso de error
      }
    });
  }

  editarReserva(reserva: any) {
    reserva.editando = true;
    reserva.copia = { ...reserva };
  }

  guardarEdicion(reserva: any) {
    if (!reserva.id) {
      console.error('No hay ID para actualizar');
      return;
    }

    const { id, copia, editando, ...dataLimpiada } = reserva;

    this.loadingService.show();
    this.firestoreService.update('formReservas', reserva.id, dataLimpiada).subscribe({
      next: () => {
        delete reserva.editando;
        delete reserva.copia;
        this.loadingService.hide();
      },
      error: err => {
        console.error('Error al actualizar reserva:', err);
        this.loadingService.hide();
      }
    });
  }

  cancelarEdicion(reserva: any) {
    Object.assign(reserva, reserva.copia);
    delete reserva.editando;
    delete reserva.copia;
  }

  eliminarReserva(index: number) {
    const reserva = this.reservas[index];
    if (!reserva.id) {
      console.error('No hay ID para eliminar');
      return;
    }

    this.loadingService.show();
    this.firestoreService.delete('formReservas', reserva.id).subscribe({
      next: () => {
        this.reservas.splice(index, 1);
        this.loadingService.hide();
      },
      error: err => {
        console.error('Error al eliminar reserva:', err);
        this.loadingService.hide();
      }
    });
  }
}
