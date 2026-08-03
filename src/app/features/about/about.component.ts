import { Component } from '@angular/core';
import { faUser, faFileArrowDown, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ResumenComponent } from '../resumen/resumen.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  imports: [FaIconComponent, ResumenComponent, TranslatePipe]
})
export class AboutComponent {
  iconFileDown = faFileArrowDown;
  iconLaptop = faLaptop;
  iconUser = faUser;

}
