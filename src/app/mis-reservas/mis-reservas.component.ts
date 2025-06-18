import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { LoginService } from '../login.service';
import { QRCodeComponent } from 'angularx-qrcode';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent {
  reservas: any[] = [];
  id: string = '';
  constructor(private firestoreService: FirestoreService, private loginService: LoginService,private route: ActivatedRoute) { 
    // Verificar si el usuario está logueado
    if (!this.loginService.username) {
      // Redirigir al usuario a la página de login si no está logueado
      window.location.href = '/login';
    }
  }
  
  cargarReservas() {
    this.firestoreService.getWhere('formReservas',[
      {fieldPath:'creadoPor', opStr: '==', value: this.loginService.username }
    ]).subscribe({
      next: (reservas) => {
        console.log('Reservas cargadas:', reservas);
        this.reservas = reservas;
      }
    });
  }

  eliminarReserva(id: string) {
    this.firestoreService.delete('formReservas', id)
      .subscribe({
        next: () => {
          // Recargar las reservas después de eliminar una
          Swal.fire("Reserva eliminada", "La reserva ha sido eliminada correctamente.", "success");
          this.cargarReservas();
        },
        error: (error) => {
          console.error('Error al eliminar la reserva:', error);
        }
      });
  }

  ngOnInit() {
    
      this.cargarReservas();
    this.route.queryParams.subscribe(params => {
      this.id = params['id'] ;
    });
    console.log('ID generado:', this.id);
  }
}