import { Component } from '@angular/core';
import {NgxChartsModule,ScaleType,LegendPosition} from '@swimlane/ngx-charts';
import { FirestoreService } from '../firestore.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-grafica',
  imports: [NgxChartsModule],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent {
  multi!:any[];
  constructor(private firestoreService:FirestoreService){}

  ngOnInit() {
    this.firestoreService.getAll('formReservas').subscribe({
      next: (data: any[]) => {
        console.log('Reservas obtenidas de Firestore:', data); // 
        this.multi = this.transformarDatos(data);
      },
      error: (err) => console.error(err)
    });
  }

transformarDatos(datos: any[]): any[] {
  const tiposHabitacionesDisponibles = [
    'Cabaña Sencilla',
    'Cabaña Doble',
    'Cabaña Triple',
    'Cabaña Familiar'
  ];
  const agrupado: { [tipo: string]: number } = {};
  tiposHabitacionesDisponibles.forEach(tipo => {
    agrupado[tipo] = 0;
  });

  datos.forEach(item => {
    const tipo = item.tipoHab?.tipo;
    const personas = item.numPersonas || 0;
    if (tipo && agrupado.hasOwnProperty(tipo)) {
      agrupado[tipo] += personas;
    }
  });

 
  const resultado = Object.keys(agrupado).map(tipo => ({
    name: tipo,
    value: agrupado[tipo]
  }));

  return resultado;
}


  view: [number,number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Cabaña';
  showYAxisLabel: boolean = true;
  xAxisLabel = '#Reservaciones';

  colorScheme: string = 'cool'; // o 'cool', 'natural', 'fire'
  schemeType: ScaleType=ScaleType.Ordinal;

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}


