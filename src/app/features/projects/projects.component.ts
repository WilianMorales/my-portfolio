import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Project } from '@app/shared/models/project.interface';
import { HttpClient } from '@angular/common/http';
import { faBriefcase, faTriangleExclamation, faSpinner, faFolderOpen, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProjectCardComponent } from '@app/shared/components/project-card/project-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, ProjectCardComponent, TranslatePipe]
})
export class ProjectsComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly iconPortfolio = faBriefcase;
  readonly iconError = faTriangleExclamation;
  readonly iconSpinner = faSpinner;
  readonly iconEmpty = faFolderOpen;
  readonly iconRetry = faRotateRight;

  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  constructor() {
    this.loadProjects();
  }

  retry(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.http.get<Project[]>('assets/data/projects.json').pipe(
      catchError(() => {
        this.hasError.set(true);
        return of([] as Project[]);
      }),
      finalize(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.projects.set(data));
  }
}
