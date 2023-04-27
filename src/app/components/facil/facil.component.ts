import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartaComponent } from '../carta/carta.component';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Ganador } from 'src/app/models/ganador';
//import { InteraccionbdService } from 'src/app/services/interaccionbd.service';
//import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-facil',
  templateUrl: './facil.component.html',
  styleUrls: ['./facil.component.scss'],
  standalone: true,
  imports: [CommonModule, CartaComponent]
})
export class FacilComponent implements OnInit {

  rutasImagenes: string[] = [
    '/assets/imagenes/leon.jpg',
    '/assets/imagenes/leon.jpg',
    '/assets/imagenes/lobo.jpg',
    '/assets/imagenes/lobo.jpg',
    '/assets/imagenes/tigre.jpg',
    '/assets/imagenes/tigre.jpg',
  ];
  img: any[] = [];
  indicesAcertados: number[] = [];
  cantidadAciertos: number = 0;
  ultimaImagen: any = undefined;
  momentoInicio: Date = new Date();
  ganadores: any[] = [];

  constructor(
    public toastController: ToastController, public router: Router, private auth: AngularFireAuth) { }

  ngOnInit() {
    this.rutasImagenes.sort(this.numeroAleatorio);

    // this.interaccion.obtenerGanadoresFacil()
    //   .subscribe(
    //     x => {
    //       this.ganadores = Object.values(x);
    //     }
    //   );
  }

  volverAlInicio() {
    this.router.navigate(['/home']);
  }

  repetirPartida() {
    this.limpiar();
  }

  recargarImagenes() {

    this.img.map(x => {
      x.habilitado = true;
      x.frente = false;
    });
    this.rutasImagenes.sort(this.numeroAleatorio);

  }

  limpiar() {
    this.recargarImagenes();
    this.indicesAcertados = [];
    this.cantidadAciertos = 0;
    this.ultimaImagen = undefined;
    this.momentoInicio = new Date();
  }

  numeroAleatorio() {
    return Math.random() - 0.5;
  }

  imagenSeleccionada(event: any) {
    setTimeout(async () => {
      if (!this.indicesAcertados.includes(event.indice)) {
        if (this.ultimaImagen != undefined) {

          if (this.ultimaImagen.indice != event.indice) {
            if (this.ultimaImagen.rutaImagen == event.rutaImagen) {
              this.ultimaImagen.habilitado = false;
              event.habilitado = false;
              this.indicesAcertados.push(this.ultimaImagen.indice);
              this.indicesAcertados.push(event.indice);
              this.img.push(event);
              this.img.push(this.ultimaImagen);
              this.ultimaImagen = undefined;
              this.cantidadAciertos++;

              if (this.cantidadAciertos == 3) {

                let momentoFin = new Date();
                let tiempo = this.obtenerMinutosYSegundos(momentoFin);
                let minutos = tiempo.minutos < 10 ? "0" + tiempo.minutos : tiempo.minutos;
                let segundos = tiempo.segundos < 10 ? "0" + tiempo.segundos : tiempo.segundos;

                this.verificarPuestos(tiempo.minutos, tiempo.segundos);

                const toast = await this.toastController.create({
                  message: `Felicitaciones! Su tiempo ha sido: ${minutos}:${segundos}`,
                  buttons: [
                    {
                      text: 'Volver al inicio',
                      //role: 'cancel', //CIERRA EL TOAST AUTOMATICAMENTE
                      handler: () => {
                        this.volverAlInicio()
                      }
                    },
                    {
                      text: 'Repetir',
                      handler: () => {
                        this.repetirPartida()
                      }
                    }
                  ],
                  // duration: 2000, //AL NO TENER DURACION, ES ETERNO
                  color: 'secondary',
                  animated: true, 
                  position: 'top',
                  cssClass: 'my-custom-class'
                });
                toast.present();
              }
            }
            else {
              //SON DISTINTAS IMAGENES
              event.frente = false;
              this.ultimaImagen.frente = false;
              this.ultimaImagen = undefined;
            }
          } else {
            //ES LA MISMA CARTA (no imagen)
            //event.frente = !event.frente; //NO HACE FALTA, YA LO MANEJA EL COMPONENTE INTERIORMENTE.
            this.ultimaImagen = undefined;
          }
        } else
          this.ultimaImagen = event;
      }
    }, 1000);
  }


  obtenerMinutosYSegundos(momentoFin: Date) {
    let differencia = momentoFin.getTime() - this.momentoInicio.getTime();
    let minutos = Math.floor(differencia / 60000); //Un minuto = 60000 milisegundos (1 seg = 1000 miliseg. 60 seg = 60000 miliseg)
    let segundos = Math.floor((differencia - minutos * 60000) / 1000);
    return { minutos: minutos, segundos: segundos };
  }

  verificarPuestos(minutos: number, segundos: number) {
    let hayGanador = false;

    if (this.ganadores.length < 5) {
      hayGanador = true;
    } else {
      for (let i = 0; i < this.ganadores.length; i++) {
        if (minutos < this.ganadores[i].minutos ||
          (minutos == this.ganadores[i].minutos &&
            segundos < this.ganadores[i].segundos)) {
          hayGanador = true;
          break;
        }
      }
    }

    if (hayGanador) {
    //  let usuario = this.auth.currentUser;
let date = new Date().toString();
debugger;
//CARGAR LISTA DE BASE
let ganador = new Ganador('', date, minutos, segundos);
//this.firestore.collection('ganadores').add(ganador);

      if (this.ganadores.length == 5) {
        this.ganadores.sort(this.ordenar);
        this.ganadores.pop();
      }
      this.ganadores.push(ganador);
     // this.interaccion.guardarGanadoresFacil(this.ganadores);

    }
  }

  ordenar(ganador1: Ganador, ganador2: Ganador) {
    if (ganador1.minutos < ganador2.minutos ||
      (ganador1.minutos == ganador2.minutos &&
        ganador1.segundos < ganador2.segundos)) {
      return -1;
    }
    return 1;
  }
}
