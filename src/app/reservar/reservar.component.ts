import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservar',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './reservar.component.html',
  styleUrl: './reservar.component.css'
})
export class ReservarComponent {
  form: FormGroup;
  datos=JSON.parse(localStorage.getItem('datosReserva') || '[]');
  tiposHabitacion = ['Cabaña sencilla', 'Cabaña doble', 'Cabaña triple', 'Cabaña familiar'];

  constructor(private fb: FormBuilder){
    this.form=this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern("^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$")]],
      fechaIngreso: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      tipoHab: ['', Validators.required],
      numPersonas: ['', [Validators.required, Validators.min(1)]]
    }, { validators: [this.fechaNoPasada(), this.fechasCoherentes(), this.maxPersonas()] });
  }

  fechaNoPasada(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ingreso=control.get('fechaIngreso')?.value;
      const fechaIngreso = new Date(ingreso);
      fechaIngreso.setHours(0, 0, 0, 0);

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if(fechaIngreso < hoy){
        return { fechaPasada: true };
      } else {
        return null;
      }
    };
  }

  fechasCoherentes(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ingreso=control.get('fechaIngreso')?.value;
      const salida=control.get('fechaSalida')?.value;
      
      const fechaIngreso = new Date(ingreso);
      const fechaSalida = new Date(salida);
      fechaIngreso.setHours(0, 0, 0, 0);
      fechaSalida.setHours(0, 0, 0, 0);
  
      if(fechaSalida < fechaIngreso){
        return { fechasInvalidas: true };
      } else if (fechaIngreso.getTime() === fechaSalida.getTime()){
        return { estanciaInvalida: true };
      }
  
      return null;
    };
  }

  maxPersonas(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const tipo=control.get('tipoHab')?.value;
      const num=control.get('numPersonas')?.value;
  
      const limites: { [key: string]: number } = {
        'Cabaña sencilla': 2,
        'Cabaña doble': 4,
        'Cabaña triple': 3,
        'Cabaña familiar': 8
      };
  
      const max=limites[tipo];
      if(num > max){
        return { maxPorTipo: max};
      } else {
        return null;
      }
    };
  }

  enviarFormulario() {
    if (this.form.valid) {
      const datosForm = this.form.value;
      this.datos.push(datosForm);
      localStorage.setItem('datosReserva', JSON.stringify(this.datos)); 
      this.form.reset();

      Swal.fire({
        title: "Reservacion lista!",
        text: "Datos guardados con exito",
        icon: "success"
      });
    }
  }
}