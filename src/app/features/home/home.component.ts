import { Component } from '@angular/core';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  iconCode = faCode;
  iconLinkedin = faLinkedin;
  iconGithub = faGithub;
}
