import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
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
  
  async cargarReservas() {
    this.reservas = await this.firestoreService.getWhere('formReservas',[{fieldPath:'nombre', opStr: '==', value: this.loginService.username }]);
  }

  ngOnInit() {
    this.cargarReservas();
  }

  

}
