import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroe';

@Pipe({
  name: 'imagen',
  /**
   * Pure sirve para decirle al pipe siempre se ejecute sin importar si cambia o no el argumento
   * y el argumento es heroe, se declara en false se activa en cada ciclo de detección de cambios
   * ya que el ciclo de detección de cambios de Angular se dispara varias veces
   */
  pure: false
})
export class ImagenPipe implements PipeTransform {

  transform(heroe: Heroe): string {
    if (!heroe.id && !heroe.alt_img) {
      return 'assets/no-image.png';
    }
    else if (heroe.alt_img) {
      return heroe.alt_img;
    }
    else {
      return `assets/heroes/${heroe.id}.jpg`;
    }
  }

}
