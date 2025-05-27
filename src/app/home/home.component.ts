import { Component } from '@angular/core';
import { DomSeguroPipe } from '../dom-seguro.pipe';

@Component({
  selector: 'app-home',
  imports: [DomSeguroPipe],
  standalone:true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  video: string="MMrAbFfVyWE?si=1v_DmWPduTh2KKPU";
}
