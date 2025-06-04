import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-altas-prueba',
  imports: [FormsModule],
  templateUrl: './altas-prueba.component.html',
  styleUrl: './altas-prueba.component.css'
})
export class AltasPruebaComponent {
  nombre: string = '';
  mensaje: string = '';
  datos: any[] = [];

  constructor(private firestoreService: FirestoreService){}

  async ngOnInit() {
    await this.cargarComentarios();
  }

  async cargarComentarios() {
    this.datos = await this.firestoreService.getAll('comentarios');
  }

  async agregarComentario() {
    if (this.nombre.trim() && this.mensaje.trim()) {
      await this.firestoreService.add('comentarios', {
        nombre: this.nombre,
        mensaje: this.mensaje,
        fecha: new Date()
      });

      this.nombre = '';
      this.mensaje = '';

      // Recarga los datos después de agregar
      await this.cargarComentarios();
    }
  }
}
