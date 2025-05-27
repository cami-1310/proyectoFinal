import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DestinosService, Destino } from '../destinos.service';

@Component({
  selector: 'app-vista-api',
  standalone:true,
  imports: [],
  templateUrl: './vista-api.component.html',
  styleUrl: './vista-api.component.css'
})
export class VistaAPIComponent implements OnChanges {
  @Input() termino: string='';
  destinos: Destino[]=[];
  destinosBusqueda: Destino[]=[];

  constructor(private destinosService: DestinosService) {}

  ngOnInit(): void {
    this.destinosService.obtenerDestinos().subscribe(data => {
      this.destinos = data;
      this.busquedaDestinos();
    });
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['termino']){
      this.busquedaDestinos();
    }
  }

  busquedaDestinos(){
    const terminoNormalizado=this.termino.toLowerCase();

    this.destinosBusqueda=this.destinos.filter(dest =>
      dest.nombre.toLowerCase().includes(terminoNormalizado) ||
      dest.actividades.some(act => act.toLowerCase().includes(terminoNormalizado))
    );
  }
}