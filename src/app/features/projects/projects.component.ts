import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Project, ProjectType } from '@app/shared/models/project.interface';
import { HttpClient } from '@angular/common/http';
import { faBriefcase, faTriangleExclamation, faSpinner, faFolderOpen, faRotateRight, faLayerGroup, faDesktop, faServer, faCubes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProjectCardComponent } from '@app/shared/components/project-card/project-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

type ProjectFilter = ProjectType | 'all';

interface FilterOption {
  value: ProjectFilter;
  labelKey: string;
  icon: IconProp;
}

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

  readonly filters: FilterOption[] = [
    { value: 'all', labelKey: 'project.filters.all', icon: faLayerGroup },
    { value: 'frontend', labelKey: 'project.filters.frontend', icon: faDesktop },
    { value: 'backend', labelKey: 'project.filters.backend', icon: faServer },
    { value: 'fullstack', labelKey: 'project.filters.fullstack', icon: faCubes }
  ];

  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly activeFilter = signal<ProjectFilter>('all');

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const projects = this.projects();
    return filter === 'all' ? projects : projects.filter(project => project.type === filter);
  });

  readonly priorityTitles = computed(() => new Set(this.projects().slice(0, 4).map(project => project.title)));

  constructor() {
    this.loadProjects();
  }

  retry(): void {
    this.loadProjects();
  }

  setFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
  }

  filterClasses(filter: ProjectFilter): string {
    const base = 'flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 whitespace-nowrap rounded-2xl sm:rounded-full h-14 w-16 sm:h-auto sm:w-auto sm:px-4 sm:py-2 font-semibold transition-all duration-300';

    if (this.activeFilter() === filter) {
      return `${base} bg-indigo-600 dark:bg-yellow-600 text-white shadow-lg scale-105`;
    }

    return `${base} text-gray-300 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-slate-700 hover:text-white dark:hover:text-yellow-400`;
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
