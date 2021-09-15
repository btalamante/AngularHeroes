import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroe';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img{
    width: 100%;
    border-radius: 5px;
  }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  }

  constructor(private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar, private _dialog: MatDialog) { }

  ngOnInit(): void {
    /**
     * Lo que estamos haciendo aquí es detectar si en la URL traemos el id del superheroe
     * Si lo traemos entonces realizamos la consulta de dicho id a la BD usando el endpoint
     * Todo esto a través de observables
     */
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          if (id) {
            return this.heroesService.getHeroePorId(id)
          }
          return of(this.heroe);
        })
      )
      .subscribe(heroe => {
        if (heroe.id) {
        }
        this.heroe = heroe
      })
  }

  guardar() {
    /**
     * Si el objeto tiene id significa que estamos editando
     */
    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroe => {
          this.mostrarSnackBar('Registro actualizado');
        });
    }
    else {
      if (this.heroe.superhero.trim().length === 0) {
        return;
      }
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          /**
           * Al realizar la inserción, automáticamente nos vamos a la ruta para editar al héroe
           */
          this.mostrarSnackBar('Registro creado correctamente');
          this.router.navigate(['/heroes/editar', heroe.id]);
        });
    }

  }

  borrarHeroe() {
    const dialog = this._dialog.open(ConfirmarComponent, {
      width: '250px',
      /**
       * La data la mandamos con el operador spread para evitar que haya modificaciones desde el dialog
       */
      data: { ...this.heroe }
    });
    dialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.heroesService.borrarrHeroe(this.heroe.id!)
            .subscribe(resp => {
              this.router.navigate(['/heroes']);
            })
        }
      });
  }

  mostrarSnackBar(mensaje: string): void {
    this._snackBar.open(mensaje, 'ok!', {
      duration: 2500
    });
  }

}
