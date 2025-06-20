import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CargandoComponent } from './cargando/cargando.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingService } from './loading.service';
import { AsyncPipe } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CargandoComponent,
    AsyncPipe 
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  isLoading$;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }
}
