import { Component, Input } from '@angular/core';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { NgFor, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NoimagePipe } from '../../pipe/noimage.pipe';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  imports: [NgFor, NgIf, FaIconComponent, NoimagePipe]
})
export class ProjectCardComponent {
  iconLink = faLink;
  iconGitHub = faGithubAlt;

  @Input() project: any; // Recibe un proyecto como Input

}
