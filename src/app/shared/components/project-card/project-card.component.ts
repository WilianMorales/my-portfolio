import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NoimagePipe } from '../../pipe/noimage.pipe';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NoimagePipe, NgOptimizedImage]
})
export class ProjectCardComponent {
  readonly iconLink = faLink;
  readonly iconGitHub = faGithubAlt;

  readonly project = input.required<Project>();
}
