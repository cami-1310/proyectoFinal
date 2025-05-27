import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public username: string='';

  constructor() { 
    const credenciales=localStorage.getItem('adminLogeado');
    if(credenciales){
      this.username = JSON.parse(credenciales).username;
    }
  }

  login(datos: any){
    localStorage.setItem('adminLogeado', JSON.stringify(datos));
    this.username=datos.username;
  }

  logout(){
    localStorage.removeItem('adminLogeado');
    this.username='';
  }
}