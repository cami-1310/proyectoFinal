import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-barra-busqueda',
  imports: [],
  templateUrl: './barra-busqueda.component.html',
  styleUrl: './barra-busqueda.component.css'
})
export class BarraBusquedaComponent {
  @Output() buscarEvent=new EventEmitter<string>(); //arroja los datos de busqueda al componente padre

  buscando(event:any){
    const texto=event.target.value;
    this.buscarEvent.emit(texto);
  }
}