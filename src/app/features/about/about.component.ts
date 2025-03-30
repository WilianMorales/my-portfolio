import { Component } from '@angular/core';
import { faUser ,faFileArrowDown, faLaptop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  iconFileDown = faFileArrowDown;
  iconLaptop = faLaptop;
  iconUser = faUser;
}
