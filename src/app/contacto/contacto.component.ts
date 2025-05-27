
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contacto',
  standalone:true,
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

  guardarDatos(form: any) {
    if (form.invalid) {
      form.form.markAllAsTouched(); 
      return;
    }

    let comentarios = JSON.parse(localStorage.getItem('comentarios') || '[]');
    comentarios.push(this.formData);
    localStorage.setItem('comentarios', JSON.stringify(comentarios));

    Swal.fire({
      icon: 'success',
      title: 'Comentario enviado',
      text: 'Gracias por tu mensaje:)'
    });

    form.resetForm();
  }
}