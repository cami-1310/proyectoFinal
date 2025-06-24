import { Component, ViewChild, ElementRef } from '@angular/core';
import { Habitaciones } from '../habitaciones';
import { Habitacion } from '../habitacion';
import { CarouselComponent } from '../carousel/carousel.component';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones',
  standalone:true,
  imports: [CarouselComponent, RouterModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {
  username: string='';
  habitaciones: Habitacion[]=Habitaciones;
  habitacionSeleccionada?: Habitacion;
  indiceHabitacion?: number;
  modal: any;

  constructor(private loginService: LoginService, private router: Router){}

  ngOnInit(){
    this.username=this.loginService.username;
  }

  openModal(habitacion: Habitacion, index: number) {
    this.habitacionSeleccionada=habitacion;
    this.indiceHabitacion=index;

    this.modal = new (window as any).bootstrap.Modal(document.getElementById('contModal')!);
    this.modal.show();
  }

  closeModal(){
    this.modal.hide();
  }

  avisarLogin(){
    Swal.fire({
      title: 'Inicia sesion',
      text: 'Debes iniciar sesion para acceder a esta opcion.',
      icon: 'warning',
      confirmButtonText: 'Ir a iniciar sesión'
    }).then((result) => {
      //lo mandamos a login
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  avisarLogin_modal(){
    this.modal.hide();
    
    Swal.fire({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para acceder a esta opción.',
      icon: 'warning',
      confirmButtonText: 'Ir a iniciar sesión'
    }).then((result) => {
      //lo mandamos a login
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}