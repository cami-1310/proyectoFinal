import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-comentarios',
  standalone: true,
  imports: [FormsModule, CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-comentarios.component.html',
  styleUrls: ['./registro-comentarios.component.css']
})
export class RegistroComentariosComponent {
  comentarios: {
    nombre: string;
    email: string;
    nacionalidad: string;
    mensaje: string;
    editando?: boolean;
    copia?: any; // Para cancelar edición
  }[] = [];

  constructor() {
    const datos = localStorage.getItem('comentarios');
    if (datos) {
      try {
        this.comentarios = JSON.parse(datos);
      } catch (e) {
        console.error('Error leyendo localStorage', e);
        this.comentarios = [];
      }
    }
  }

  editarComentario(comentario: any) {
    comentario.editando = true;
    comentario.copia = { ...comentario }; // Guarda una copia por si se cancela
  }

  guardarEdicion(comentario: any) {
    delete comentario.editando;
    delete comentario.copia;
    this.actualizarLocalStorage();
  }

  cancelarEdicion(comentario: any) {
    Object.assign(comentario, comentario.copia);
    delete comentario.editando;
    delete comentario.copia;
  }

  eliminarComentario(index: number) {
    this.comentarios.splice(index, 1);
    this.actualizarLocalStorage();
  }

  private actualizarLocalStorage() {
    localStorage.setItem('comentarios', JSON.stringify(this.comentarios));
  }
}
