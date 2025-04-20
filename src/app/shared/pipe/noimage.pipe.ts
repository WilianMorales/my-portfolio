import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {
  transform(image: string): string {

    // Verificamos si la URL de la imagen es válida
    if (!image || image.trim() === '') {
      return 'assets/images/noimage.webp';
    }

    // Intentamos cargar la imagen
    const img = new Image();
    img.src = image;

    img.onerror = () => {
      return 'assets/images/noimage.webp'; // Si no se encuentra, se usa la imagen por defecto
    };

    return image;
  }
}
