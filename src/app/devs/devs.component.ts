import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-devs',
  imports: [RouterModule],
  templateUrl: './devs.component.html',
  styleUrl: './devs.component.css'
})
export class DevsComponent {
  imgRafa: string="rafa.png";
  imgCami: string="camila.png";
}