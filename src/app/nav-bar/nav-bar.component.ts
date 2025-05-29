import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { SpeechService } from '../speech.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [RouterModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  username: string='';
  mostrarPanel = false;
  fuenteSeleccionada: any;
  fuenteIndex = 0;
  fuentesClases = ['fuente-arial', 'fuente-verdana', 'fuente-roboto', 'fuente-Times'];
  contrasteActivo = false;


  constructor(private loginService: LoginService, private router: Router, private speechService: SpeechService){ }

  ngOnInit(){
    this.username=this.loginService.username;
  }

  leerPantalla() {
    const texto = document.body.innerText;
    this.speechService.speak(texto);
  }

  pausarLectura() {
    this.speechService.pause();
  }

  ContinuarLectura(){
    this.speechService.resume();
  }

  detenerLectura() {
    this.speechService.cancel();
  }

cambiarFuente() {
  document.body.classList.remove(...this.fuentesClases);
  const nuevaFuente = this.fuentesClases[this.fuenteIndex];
  document.body.classList.add(nuevaFuente);
  this.fuenteIndex = (this.fuenteIndex + 1) % this.fuentesClases.length;
}


  cambiarTamanoTexto(accion: 'aumentar' | 'disminuir') {
    const root = document.documentElement;
    const sizeActual = parseFloat(getComputedStyle(root).fontSize);
    const nuevoTam = accion === 'aumentar' ? sizeActual + 1 : sizeActual - 1;
    root.style.fontSize = `${nuevoTam}px`;
  }

  cambiarContraste() {

    this.contrasteActivo = !this.contrasteActivo;
        if (this.contrasteActivo) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
  }


  salir(){
    this.loginService.logout();
    this.username=this.loginService.username;
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}