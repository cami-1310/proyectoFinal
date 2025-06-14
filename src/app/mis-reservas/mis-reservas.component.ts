import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { LoginService } from '../login.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent {
  reservas: any[] = [];
  constructor(private firestoreService: FirestoreService, private loginService: LoginService) { 
    // Verificar si el usuario está logueado
    if (!this.loginService.username) {
      // Redirigir al usuario a la página de login si no está logueado
      window.location.href = '/login';
    }
  }
  
  cargarReservas() {
    this.firestoreService.getWhere('formReservas',[
      {fieldPath:'nombre', opStr: '==', value: this.loginService.username }
    ]).subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      }
    });
  }

  ngOnInit() {
    this.cargarReservas();
  }
}