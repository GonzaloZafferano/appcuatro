import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { Ganador } from 'src/app/models/ganador';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CartaComponent } from '../carta/carta.component';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dificil',
  templateUrl: './dificil.component.html',
  styleUrls: ['./dificil.component.scss'],
  standalone: true,
  imports: [CommonModule, CartaComponent, IonicModule]

})
export class DificilComponent  implements OnInit {
  isToastOpen = false;
  mensajeToast = '';
  toastButtons = [
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
  ];

  rutasImagenes: string[] = [
    '/assets/imagenes/manzana.png',
    '/assets/imagenes/manzana.png',
    '/assets/imagenes/naranja.png',
    '/assets/imagenes/naranja.png',
    '/assets/imagenes/Banana.png',
    '/assets/imagenes/Banana.png',
    '/assets/imagenes/pera.png',
    '/assets/imagenes/pera.png',
    '/assets/imagenes/frutilla.png',
    '/assets/imagenes/frutilla.png',
  ];
  
  img: any[] = [];
  indicesAcertados: number[] = [];
  cantidadAciertos: number = 0;
  ultimaImagen: any = undefined;
  momentoInicio: Date = new Date();
  ganadores: any[] = [];
  correoUsuario: string = '';
  mensajeTiempo: string = '00s 000ms';
  intervaloActivo: any = null;
  tiempoObtendo: any = null;
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  constructor(private firestore: FirestoreService,
    public toastController: ToastController, public router: Router, private auth: AngularFireAuth) {

  }

  ngOnInit() {
    this.limpiar();
    this.auth.currentUser.then((x) => {
      this.correoUsuario = x?.email ? x.email : '';
    });

    this.firestore.obtenerGanadoresDificil().subscribe((info) => {
      this.ganadores = info;
    });
  }

  volverAlInicio() {
    this.router.navigate(['/home']);
    this.limpiar();
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
    this.rutasImagenes.sort(this.numeroAleatorio);
  }

  limpiar() {
    this.recargarImagenes();
    this.indicesAcertados = [];
    this.cantidadAciertos = 0;
    this.ultimaImagen = undefined;
    this.momentoInicio = new Date();
    this.mensajeToast = '';
    this.mensajeTiempo = '00s 000ms';
    this.setOpen(false);
    if (this.intervaloActivo) {
      this.intervaloActivo.unsubscribe();
      this.intervaloActivo = null;
    }
    this.tiempoObtendo = null;
  }

  numeroAleatorio() {
    return Math.random() - 0.5;
  }

  async imagenSeleccionada(event: any) {
    this.img.push(event);
    let primerIngreso = false;
    if (!this.intervaloActivo) {
      this.momentoInicio = new Date();
      this.intervaloActivo = interval(100).subscribe(() => {
        this.tiempoObtendo = this.obtenerSegundosYMilisegundos(new Date());

        if(this.tiempoObtendo.segundos == 0 && primerIngreso){
          this.mensajeToast = "Se acabo el tiempo!";
          this.intervaloActivo.unsubscribe();
          this.setOpen(true);
        }
        else {

          if(this.tiempoObtendo.segundos > 0)
          primerIngreso = true;
          let milisegundos = this.tiempoObtendo.milisegundos < 10 ? "0" + this.tiempoObtendo.milisegundos : this.tiempoObtendo.milisegundos;
          let segundos = this.tiempoObtendo.segundos < 10 ? "0" + this.tiempoObtendo.segundos : this.tiempoObtendo.segundos;
          this.mensajeTiempo = `${segundos}s ${milisegundos}ms`;
        } 
      });
    }

    setTimeout(async () => {
      if (!this.indicesAcertados.includes(event.indice)) {
        if (this.ultimaImagen != undefined) {

          if (this.ultimaImagen.indice != event.indice) {
            if (this.ultimaImagen.rutaImagen == event.rutaImagen) {
              this.ultimaImagen.habilitado = false;
              event.habilitado = false;
              this.indicesAcertados.push(this.ultimaImagen.indice);
              this.indicesAcertados.push(event.indice);
              //this.img.push(event);
              //this.img.push(this.ultimaImagen);
              this.ultimaImagen = undefined;
              this.cantidadAciertos++;

              if (this.cantidadAciertos == 5) {

                //let momentoFin = new Date();
                this.intervaloActivo.unsubscribe();
                //let tiempo = this.obtenerSegundosYMilisegundos(momentoFin);
                let milisegundos = this.tiempoObtendo.milisegundos < 10 ? "0" + this.tiempoObtendo.milisegundos : this.tiempoObtendo.milisegundos;
                let segundos = this.tiempoObtendo.segundos < 10 ? "0" + this.tiempoObtendo.segundos : this.tiempoObtendo.segundos;

                let hayGanador = this.verificarPuestos(this.tiempoObtendo.segundos, this.tiempoObtendo.milisegundos);

                this.mensajeToast = `Felicitaciones! Su tiempo ha sido: ${segundos}s ${milisegundos}ms. `
                if (hayGanador) {
                  this.mensajeToast += "Además, ha ingresado al TOP 5 de ganadores!"
                }

                this.setOpen(true);
                // const toast = await this.toastController.create({
                //   message: mensaje,
                //   buttons: [
                //     {
                //       text: 'Volver al inicio',
                //       //role: 'cancel', //CIERRA EL TOAST AUTOMATICAMENTE
                //       handler: () => {
                //         this.volverAlInicio()
                //       }
                //     },
                //     {
                //       text: 'Repetir',
                //       handler: () => {
                //         this.repetirPartida()
                //       }
                //     }
                //   ],
                //   // duration: 2000, //AL NO TENER DURACION, ES ETERNO
                //   color: 'secondary',
                //   animated: true,
                //   position: 'top',
                //   cssClass: 'my-custom-toast'
                // });
                // toast.present();
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

  obtenerSegundosYMilisegundos(momentoFin: Date) {
    let diferencia = momentoFin.getTime() - this.momentoInicio.getTime();
    let minutos = Math.floor(diferencia / 60000); //Un minuto = 60000 milisegundos (1 seg = 1000 miliseg. 60 seg = 60000 miliseg)
    let segundos = Math.floor((diferencia - minutos * 60000) / 1000);
    let milisegundos = 0;
    if (diferencia < 1000)
      milisegundos = diferencia;
    else    
      milisegundos = Math.floor((diferencia/1000 - Math.floor(diferencia/1000)) *1000);
    
    return { segundos: segundos, milisegundos: milisegundos };
  }

  verificarPuestos(segundos: number, milisegundos: number) {
    //Si ganador es true, quiere decir que lo tengo que meter en el top 5.
    let hayGanador = false;

    if (this.ganadores.length < 5) {
      hayGanador = true;
    } else {
      for (let i = 0; i < this.ganadores.length; i++) {
        if (segundos < this.ganadores[i].segundos ||
          (segundos == this.ganadores[i].segundos &&
            milisegundos < this.ganadores[i].milisegundos)) {
          hayGanador = true;
          let ganadoresOrdenados = this.ganadores.sort(this.ordenar);
          let ultimoPuesto = ganadoresOrdenados.pop();
          this.firestore.eliminarGanadorDificil(ultimoPuesto.id);
          break;
        }
      }
    }
    if (hayGanador) {
      let ganador = new Ganador(this.correoUsuario, new Date(), segundos, milisegundos, '');
      this.firestore.guardarDificil(ganador);
    }
    return hayGanador;
  }

  ordenar(ganador1: Ganador, ganador2: Ganador) {
    if (ganador1.segundos < ganador2.segundos ||
      (ganador1.segundos == ganador2.segundos &&
        ganador1.milisegundos < ganador2.milisegundos)) {
      return -1;
    }
    return 1;
  }
}


