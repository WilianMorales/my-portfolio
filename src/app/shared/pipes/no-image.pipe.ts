import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'noImage' })
export class NoImagePipe implements PipeTransform {
  transform(image: string): string {
    if (!image || image.trim() === '') {
      return 'assets/images/noimage.webp';
    }

    return image;
  }
}
