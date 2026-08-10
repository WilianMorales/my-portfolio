import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]'
})
export class ImgFallbackDirective {
  readonly appImgFallback = output<void>();
  private hasFired = false;

  @HostListener('error')
  onError(): void {
    if (this.hasFired) return;

    this.hasFired = true;
    this.appImgFallback.emit();
  }
}
