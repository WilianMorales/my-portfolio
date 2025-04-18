import { Component, Input } from '@angular/core';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  iconLink = faLink;
  iconGitHub = faGithubAlt;

  @Input() project: any; // Recibe un proyecto como Input

}
