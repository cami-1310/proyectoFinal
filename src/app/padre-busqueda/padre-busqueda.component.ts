import { Component } from '@angular/core';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { VistaAPIComponent } from '../vista-api/vista-api.component';

@Component({
  selector: 'app-padre-busqueda',
  imports: [BarraBusquedaComponent, VistaAPIComponent],
  templateUrl: './padre-busqueda.component.html',
  styleUrl: './padre-busqueda.component.css'
})
export class PadreBusquedaComponent {
  terminoBusqueda: string='';

  recibirBusqueda(termino: string){
    this.terminoBusqueda=termino;
  }
}
