import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  formData = {
    nombre: '',
    email: '',
    nacionalidad: '',
    mensaje: ''
  };

  paises: string[] = [
    'México',
    'Argentina',
    'Colombia',
    'Perú',
    'Chile',
    'Venezuela',
    'Ecuador',
    'Guatemala',
    'Bolivia',
    'Uruguay',
    'Cuba'
  ];

  constructor(private firestoreService: FirestoreService) {}

  guardarDatos(form: any) {
    if (form.invalid) {
      form.form.markAllAsTouched(); 
      return;
    }

    this.firestoreService.add('formContacto', this.formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Comentario enviado',
          text: 'Gracias por tu mensaje:)'
        });
    
        //resetear el form
        //primero el objeto
        this.formData = {
          nombre: '',
          email: '',
          nacionalidad: '',
          mensaje: ''
        };
    
        form.resetForm(this.formData);
      }
    });
  }
}