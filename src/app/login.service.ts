import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public username: string='';
  tipoUsuario: string='';
  
  constructor() {
    const usernameGuardado=localStorage.getItem('username');
    const tipoGuardado=localStorage.getItem('tipoUsuario');
    if (usernameGuardado) this.username=usernameGuardado;
    if (tipoGuardado) this.tipoUsuario=tipoGuardado;
  }

  login(datos: any, tipoUsuario: string){
    this.username=datos.username;
    this.tipoUsuario=tipoUsuario;
    //seguimos guardando en localStorage porque como recargamos la pagina
    //en login, el username se pierde, entonces requiero guardarlo
    localStorage.setItem('username', this.username);
    localStorage.setItem('tipoUsuario', this.tipoUsuario);
  }

  logout(){
    this.username='';
    this.tipoUsuario='';
    localStorage.removeItem('username');
    localStorage.removeItem('tipoUsuario');
  }
}