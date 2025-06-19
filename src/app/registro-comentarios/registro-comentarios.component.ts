import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-registro-comentarios',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-comentarios.component.html',
  styleUrls: ['./registro-comentarios.component.css']
})
export class RegistroComentariosComponent {
  comentarios: {
    id?: string;
    nombre: string;
    email: string;
    nacionalidad: string;
    mensaje: string;
    editando?: boolean;
    copia?: any; // Para cancelar edición
  }[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    //obtenemos toda la info de la coleccion
    this.firestoreService.getAll('formContacto').subscribe({
      next: data => {
        this.comentarios=data;
      }
    });
  }

  editarComentario(comentario: any) {
    comentario.editando = true;
    comentario.copia = { ...comentario }; // Guarda una copia por si se cancela
  }

  guardarEdicion(comentario: any) {
    if (!comentario.id) {
      console.error('No hay ID para actualizar');
      return;
    }

    //especificando qué vamos a guardar en la BD
    const { id, copia, editando, ...dataLimpiada }=comentario;

    this.firestoreService.update('formContacto', comentario.id, dataLimpiada).subscribe({
      next: () => {
        delete comentario.editando;
        delete comentario.copia;
      },
      error: err => {
        console.error('Error al actualizar comentario:', err);
      }
    });
  }

  cancelarEdicion(comentario: any) {
    Object.assign(comentario, comentario.copia);
    delete comentario.editando;
    delete comentario.copia;
  }

  eliminarComentario(index: number) {
    const comentario=this.comentarios[index];
    if (!comentario.id) {
      console.error('No hay ID para eliminar');
      return;
    }
    this.firestoreService.delete('formContacto', comentario.id).subscribe({
      next: () => {
        this.comentarios.splice(index, 1);
      }
    });
  }
}