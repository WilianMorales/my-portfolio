import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { faExpand, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NoImagePipe } from '@app/shared/pipes/no-image.pipe';
import { ImgFallbackDirective } from '@app/shared/directives/img-fallback.directive';
import { Project } from '@app/shared/models/project.interface';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ImageGalleryModalComponent } from '@app/shared/components/image-gallery-modal/image-gallery-modal.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NoImagePipe, NgOptimizedImage, TranslatePipe, ImageGalleryModalComponent, ImgFallbackDirective]
})
export class ProjectCardComponent {
  private readonly translate = inject(TranslateService);

  readonly iconLink = faLink;
  readonly iconGitHub = faGithubAlt;
  readonly iconExpand = faExpand;

  readonly project = input.required<Project>();
  readonly priority = input(false);

  readonly isGalleryOpen = signal(false);
  readonly imageFailed = signal(false);
  readonly hasGallery = computed(() => (this.project().images?.length ?? 0) > 1);
  readonly cardImage = computed(() => (this.imageFailed() ? '' : this.project().image));
  readonly galleryImages = computed(() => {
    const project = this.project();
    return project.images?.length ? project.images : [project.image];
  });

  private readonly currentLang = toSignal(
    this.translate.onLangChange.pipe(map(event => event.lang)),
    { initialValue: this.translate.currentLang || this.translate.getDefaultLang() || 'es' }
  );

  readonly description = computed(() => {
    const description = this.project().description;
    const lang = this.currentLang();
    return description[lang as keyof typeof description] ?? description.es;
  });

  openGallery(): void {
    if (!this.hasGallery()) return;
    this.isGalleryOpen.set(true);
  }

  closeGallery(): void {
    this.isGalleryOpen.set(false);
  }

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
