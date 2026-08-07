import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NoImagePipe } from '@app/shared/pipes/no-image.pipe';
import { Project } from '@app/shared/models/project.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NoImagePipe, NgOptimizedImage, TranslatePipe]
})
export class ProjectCardComponent {
  readonly iconLink = faLink;
  readonly iconGitHub = faGithubAlt;

  readonly project = input.required<Project>();
  readonly priority = input(false);
}
