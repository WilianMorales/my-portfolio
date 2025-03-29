import { Component } from '@angular/core';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  name: string = 'Wilian Morales';
  iconTerminal = faTerminal;
}
