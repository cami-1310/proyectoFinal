import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxChartsModule, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { FirestoreService } from '../firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [NgxChartsModule,CommonModule],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent implements OnInit, OnDestroy {
  multi!: any[];
  view: [number, number] = [700, 400];
  resizeObserver!: ResizeObserver;

  @ViewChild('graficaContenedor', { static: true }) contenedorRef!: ElementRef;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.firestoreService.getAll('formReservas').subscribe({
      next: (data: any[]) => {
        //console.log('Reservas obtenidas de la BD:', data);
        this.multi = this.transformarDatos(data);
      },
      error: (err) => console.error(err)
    });

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        this.view = [width - 40, 400]; // ajusta el padding/margen si necesitas
      }
    });

    this.resizeObserver.observe(this.contenedorRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  transformarDatos(datos: any[]): any[] {
    const tiposHabitacionesDisponibles = [
      'Cabaña Sencilla',
      'Cabaña Doble',
      'Cabaña Triple',
      'Cabaña Familiar'
    ];
    const agrupado: { [tipo: string]: number } = {};
    tiposHabitacionesDisponibles.forEach(tipo => agrupado[tipo] = 0);

    datos.forEach(item => {
      const tipo = item.tipoHab?.tipo;
      const personas = item.numPersonas || 0;
      if (tipo && agrupado.hasOwnProperty(tipo)) {
        agrupado[tipo] += personas;
      }
    });

    return Object.keys(agrupado).map(tipo => ({
      name: tipo,
      value: agrupado[tipo]
    }));
  }

  // opciones del gráfico
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = '# de Reservaciones';
  showYAxisLabel = true;
  yAxisLabel = 'Cabaña';
  colorScheme = 'cool';
  schemeType = ScaleType.Ordinal;
}