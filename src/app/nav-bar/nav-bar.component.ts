import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { SpeechService } from '../speech.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [RouterModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  username: string='';
  tipoUsuario: string='';
  mostrarPanel = false;
  fuenteSeleccionada: any;
  fuenteIndex = 0;
  fuentesClases = ['fuente-arial', 'fuente-verdana', 'fuente-roboto', 'fuente-Times'];
  contrasteActivo = false;

  constructor(private loginService: LoginService, private router: Router, private speechService: SpeechService){ }

  ngOnInit(){
    this.username=this.loginService.username;
    this.tipoUsuario=this.loginService.tipoUsuario;
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

  avisarLogin(){
    Swal.fire({
      title: 'Inicia sesion',
      text: 'Debes iniciar sesion para acceder a esta opcion.',
      icon: 'warning',
      confirmButtonText: 'Ir a iniciar sesión'
    }).then((result) => {
      //lo mandamos a login
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}