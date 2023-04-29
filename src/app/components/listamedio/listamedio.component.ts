import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-listamedio',
  templateUrl: './listamedio.component.html',
  styleUrls: ['./listamedio.component.scss'],
  standalone : true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListamedioComponent  implements OnInit {
  constructor(private firestore: FirestoreService, private router: Router,public loadingController: LoadingController) { }
  ganadores: any[] = [];
  ngOnInit() {
    this.cargar(); 
  }

 cargar(){
  //let loading = this.presentLoading();
  this.firestore.obtenerGanadoresMedio().subscribe(async (info) => {
    this.ganadores = info.sort(this.ordenar);
  // (await loading).dismiss(); 
  });
}
  volverInicio(){
    this.router.navigate(['/home']);
  }

  obtenerFechaString(ganador : any) {   
    
    //OBTENGO LA FECHA A PARTIR DE (SEGUNDOS TOTALES *1000)
    let fecha = new Date(ganador.fecha.seconds * 1000);
    let dia = fecha.getDate() + 1;
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();

    let cadenaDia = dia < 10 ? '0' + dia.toString() : dia.toString();
    let cadenaMes = mes < 10 ? '0' + mes.toString() : mes.toString();  

    return cadenaDia + '-' + cadenaMes + '-' + anio.toString();
  }

  ordenar(ganador1: any, ganador2: any) {
    if (ganador1.segundos < ganador2.segundos ||
      (ganador1.segundos == ganador2.segundos &&
        ganador1.milisegundos < ganador2.milisegundos)) {
      return -1;
    }
    return 1;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo datos',
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'custom-class'
    });

    await loading.present();
    return loading;
  }

}
