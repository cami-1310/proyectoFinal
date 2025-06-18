import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { PaypalComponent } from '../paypal/paypal.component';
import { Habitacion } from '../habitacion';
import { Habitaciones } from '../habitaciones';
import { PaypalService } from '../paypal.service';
import { ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-reservar',
  standalone:true,
  imports: [ReactiveFormsModule, PaypalComponent, QRCodeComponent],
  templateUrl: './reservar.component.html',
  styleUrl: './reservar.component.css'
})
export class ReservarComponent {
  form: FormGroup;
  idGenerado: string = '';
  habitaciones:Habitacion[]=Habitaciones;
  tiposHabitacion = ['Cabaña sencilla', 'Cabaña doble', 'Cabaña triple', 'Cabaña familiar'];
  formEnviado: boolean=false;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService, public paypalService: PaypalService, private loginService: LoginService){
    this.form=this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern("^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$")]],
      fechaIngreso: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      tipoHab: ['', Validators.required],
      numPersonas: ['', [Validators.required, Validators.min(1)]]
    }, { validators: [this.fechaNoPasada(), this.fechasCoherentes(), this.maxPersonas(), this.validarPago()] });

    //Para que no nos salgan errores iniciales 
    this.form.markAsPristine(); // indica que no ha sido modificado
    this.form.markAsUntouched(); // indica que no ha sido tocado
    this.form.updateValueAndValidity(); // recalcula validaciones
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.obtenerTotal(); // recalcula total en cada cambio del formulario
    });
  }

  @ViewChild('reservaModal') reservaModal!: ElementRef;

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
      const tipoHab=control.get('tipoHab')?.value; //esto es un objeto con 2 campos: tipo y costo
      const num=control.get('numPersonas')?.value;

      //objeto que asocia el tipo de cabaña con su num maximo de personas
      const limites: { [key: string]: number } = {
        'Cabaña Sencilla': 2,
        'Cabaña Doble': 4,
        'Cabaña Triple': 3,
        'Cabaña Familiar': 8
      };

      if (!tipoHab || typeof tipoHab !== 'object' || !tipoHab.tipo) {
        return null;
      }

      //accede al campo tipo del objeto, y busca ese string como clave en limites
      const max=limites[tipoHab.tipo]; //max guarda el maximo asociado al string de tipo
      if(num > max){
        return { maxPorTipo: max};
      } else {
        return null;
      }
    };
  }

  //para asegurarnos que el pago se hizo
  onPagoHecho() {
    this.paypalService.banderaPago=true;
    this.form.updateValueAndValidity();
  }

  validarPago(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      if(this.paypalService.banderaPago){
        //ya pagó
        return null;
      } else {
        return { pagoNoRealizado: true }; //no ha pagado
      }
    };
  }

  obtenerTotal(){
    const tipoHab=this.form.get('tipoHab')?.value;
    const fechaIngreso=new Date(this.form.get('fechaIngreso')?.value);
    const fechaSalida=new Date(this.form.get('fechaSalida')?.value);

    const precios: { [key: string]: number } = {
      'Cabaña Sencilla': 500,
      'Cabaña Doble': 800,
      'Cabaña Triple': 1200,
      'Cabaña Familiar': 1500
    };

    const precio=precios[tipoHab?.tipo];
    const dif=fechaSalida.getTime()-fechaIngreso.getTime();
    const noches=Math.floor(dif/(1000 * 60 * 60 * 24));

    this.paypalService.total=noches*precio;
  }

  enviarFormulario(){
    this.formEnviado=true;
    //guardando en la BD

    this.form.value.creadoPor = this.loginService.username;
    this.firestoreService.add('formReservas', this.form.value).subscribe({
      next: (res) => {
        this.idGenerado = res.id;
        const modal = new bootstrap.Modal(this.reservaModal.nativeElement);
        modal.show();
        //reseteamos todo
        this.form.reset(); // limpia campos
        //luego para que no nos salgan errores iniciales 
        this.form.markAsPristine(); // indica que no ha sido modificado
        this.form.markAsUntouched(); // indica que no ha sido tocado
        this.paypalService.banderaPago=false; // mandar a falso la bandera
        this.form.updateValueAndValidity(); // recalcula validaciones
        this.formEnviado=false;
      }
    });
  }
}