import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project } from '@app/shared/models/project.interface';
import { HttpClient } from '@angular/common/http';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProjectCardComponent } from '@app/shared/components/project-card/project-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, ProjectCardComponent, TranslatePipe]
})
export class ProjectsComponent {
  private readonly http = inject(HttpClient);

  readonly iconPortfolio = faBriefcase;

  readonly projects = toSignal(
    this.http.get<Project[]>('assets/data/projects.json'),
    { initialValue: [] as Project[] }
  );
}
