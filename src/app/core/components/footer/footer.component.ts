import { Component } from '@angular/core';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  imports: [FaIconComponent, TranslatePipe]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  name: string = 'Wilian Morales';
  iconTerminal = faTerminal;
}
