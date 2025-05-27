import { Component } from '@angular/core';
import { Dev } from '../dev';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dev',
  imports: [RouterModule],
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.css'
})
export class DevComponent {
  dev!: Dev | undefined;

  devs: Dev[] = [
    {
      imagen: 'rafa.png',
      nom: 'Rafael Marquez Macias',
      id: 350426,
      carrera_grupo: 'ISC 6to A',
      frase:"Si el problema tiene solucion, ¿pa' que te preocupas?. Y si no tiene, ¿pa' que te preocupas?"
    },
    {
      imagen: 'camila.png',
      nom: 'Camila Jaasiel Mendoza Martinez',
      id: 347948,
      carrera_grupo: 'ISC 6to A',
      frase:"Todo lo que pierdes es un paso que das. (Taylor Swift)"
    }
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const id = Number(params['id']);
      this.dev = this.devs.find(d => d.id === id);
    });
  }
}