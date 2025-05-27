import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  username: string='';

  constructor(private loginService: LoginService, private router: Router){ }

  ngOnInit(){
    this.username=this.loginService.username;
  }

  salir(){
    this.loginService.logout();
    this.username=this.loginService.username;
    //redirige a home y luego recarga la pagina
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}