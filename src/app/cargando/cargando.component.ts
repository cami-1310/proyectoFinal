import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cargando',
  standalone: true,
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.css']
})
export class CargandoComponent {
  @Input() isLoading = false;
}
