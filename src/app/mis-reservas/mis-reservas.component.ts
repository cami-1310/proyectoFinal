import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';


@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent {
  reservas: any[] = [];
  constructor(private firestoreService: FirestoreService) { 
  }
  
  async cargarReservas() {
    this.reservas = await this.firestoreService.getAll('reservas');
  }
}
