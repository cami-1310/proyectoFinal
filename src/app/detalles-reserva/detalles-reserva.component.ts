import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { LoginService } from '../login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalles-reserva',
  imports: [],
  templateUrl: './detalles-reserva.component.html',
  styleUrl: './detalles-reserva.component.css'
})
export class DetallesReservaComponent {
   reserva: any = {};
    id: string = '';
    constructor(private firestoreService: FirestoreService, private loginService: LoginService,private route: ActivatedRoute) { 
      // Verificar si el usuario está logueado
      if (!this.loginService.username) {
        // Redirigir al usuario a la página de login si no está logueado
        window.location.href = '/login';
      }
    }
    
    cargarReserva() {
      this.id = this.route.snapshot.paramMap.get('id') || '';
      this.firestoreService.getById('formReservas', this.id).subscribe({
        next: (reserva) => {
    
          this.reserva = reserva
          if (!this.reserva) {
            console.error('Reserva no encontrada');
          } else {
            console.log('Reserva cargada:', this.reserva);
          }
        }
      });
    }
  
    ngOnInit() {
      this.cargarReserva();
    }
}
