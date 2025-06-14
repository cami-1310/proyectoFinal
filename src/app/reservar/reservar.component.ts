import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { PaypalComponent } from '../paypal/paypal.component';
import { Habitacion } from '../habitacion';
import { Habitaciones } from '../habitaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservar',
  standalone:true,
  imports: [ReactiveFormsModule, PaypalComponent, QRCodeComponent],
  templateUrl: './reservar.component.html',
  styleUrl: './reservar.component.css'
})
export class ReservarComponent {
  form: FormGroup;
  habitaciones:Habitacion[]=Habitaciones;
  tiposHabitacion = ['Cabaña sencilla', 'Cabaña doble', 'Cabaña triple', 'Cabaña familiar'];

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService){
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
      this.firestoreService.add('formReservas', this.form.value);
      this.form.reset(); // limpia campos
      //luego para que no nos salgan errores iniciales 
      this.form.markAsPristine(); // indica que no ha sido modificado
      this.form.markAsUntouched(); // indica que no ha sido tocado
      this.form.updateValueAndValidity(); // recalcula validaciones
    }
  }
}