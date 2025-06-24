import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PadreBusquedaComponent } from '../padre-busqueda/padre-busqueda.component';

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [PadreBusquedaComponent],
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.css'
})
export class DestinosComponent {

  actividades: { nombre: string; path: SafeHtml }[];

  constructor(private sanitizer: DomSanitizer) {
    this.actividades = [
      {
        nombre: "Esquí",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 3a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M17 17.5l-5 -4.5v-6l5 4" />
            <path d="M7 17.5l5 -4.5" />
            <path d="M15.103 21.58l6.762 -14.502a2 2 0 0 0 -.968 -2.657" />
            <path d="M8.897 21.58l-6.762 -14.503a2 2 0 0 1 .968 -2.657" />
            <path d="M7 11l5 -4" />
          </svg>
        `)
      },
      {
        nombre: "Snowboard",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M7 19l4 -2.5l-.5 -1.5" />
            <path d="M16 21l-1 -6l-4.5 -3l3.5 -6" />
            <path d="M7 9l1.5 -3h5.5l2 4l3 1" />
            <path d="M3 17c.399 1.154 .899 1.805 1.5 1.951c6 1.464 10.772 2.262 13.5 2.927c1.333 .325 2.333 0 3 -.976" />
          </svg>
        `)
      },
      {
        nombre: "Paseos",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6.414 6.414a2 2 0 0 0 0 -2.828l-1.414 -1.414l-2.828 2.828l1.414 1.414a2 2 0 0 0 2.828 0z" />
            <path d="M17.586 17.586a2 2 0 0 0 0 2.828l1.414 1.414l2.828 -2.828l-1.414 -1.414a2 2 0 0 0 -2.828 0z" />
            <path d="M6.5 6.5l11 11" />
            <path d="M22 2.5c-9.983 2.601 -17.627 7.952 -20 19.5c9.983 -2.601 17.627 -7.952 20 -19.5z" />
            <path d="M6.5 12.5l5 5" />
            <path d="M12.5 6.5l5 5" />
          </svg>
        `)
      },
      {
        nombre: "Museos",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21l18 0" />
            <path d="M4 21v-15a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v15" />
            <path d="M9 21v-8a3 3 0 0 1 6 0v8" />
          </svg>
        `)
      },
      {
        nombre: "Senderismo",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612z" />
            <path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" />
          </svg>
        `)
      },
      {
        nombre: "Parapente",
        path: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12a10 10 0 1 0 -20 0" />
            <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
            <path d="M2 12l10 10l-3.5 -10" />
            <path d="M15.5 12l-3.5 10l10 -10" />
          </svg>
        `)
      }
    ];
  }
}