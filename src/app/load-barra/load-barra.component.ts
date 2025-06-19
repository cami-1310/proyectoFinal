import { Component, input } from '@angular/core';

@Component({
  selector: 'app-load-barra',
  standalone:true,
  imports: [],
  templateUrl: './load-barra.component.html',
  styleUrl: './load-barra.component.css'
})
export class LoadBarraComponent {
  @Input() isLoading = false;
}