import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { NoImagePipe } from '@app/shared/pipes/no-image.pipe';
import { ImgFallbackDirective } from '@app/shared/directives/img-fallback.directive';

@Component({
  selector: 'app-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrl: './image-gallery-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NgOptimizedImage, NoImagePipe, TranslatePipe, ImgFallbackDirective]
})
export class ImageGalleryModalComponent {
  readonly iconClose = faTimes;
  readonly iconPrev = faChevronLeft;
  readonly iconNext = faChevronRight;

  readonly isOpen = input(false);
  readonly images = input<string[]>([]);
  readonly title = input('');

  readonly closed = output<void>();

  readonly currentIndex = signal(0);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  readonly hasMultiple = computed(() => this.images().length > 1);
  readonly currentImage = computed(() => {
    const src = this.images()[this.currentIndex()] ?? '';
    return this.failedImages().has(src) ? '' : src;
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.currentIndex.set(0);
        this.failedImages.set(new Set());
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  next(): void {
    const total = this.images().length;
    if (total < 2) return;
    this.currentIndex.update(i => (i + 1) % total);
  }

  prev(): void {
    const total = this.images().length;
    if (total < 2) return;
    this.currentIndex.update(i => (i - 1 + total) % total);
  }

  selectImage(index: number): void {
    this.currentIndex.set(index);
  }

  thumbSrc(src: string): string {
    return this.failedImages().has(src) ? '' : src;
  }

  onImageError(src: string): void {
    if (!src || this.failedImages().has(src)) return;
    this.failedImages.update(set => new Set(set).add(src));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
    }
  }
}
