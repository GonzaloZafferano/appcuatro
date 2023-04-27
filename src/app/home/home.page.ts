// import { Component } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { LoginComponent } from '../components/login/login.component';
// import { FormsModule } from '@angular/forms';
// import { Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RegistroComponent } from '../components/registro/registro.component';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';
// import { BienvenidoComponent } from '../components/bienvenido/bienvenido.component';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
//   standalone: true,
//   imports: [IonicModule,
//     CommonModule,
//     FormsModule,
//     LoginComponent,
//     RegistroComponent,
//     BienvenidoComponent], //Array de MODULOS Y 'COMPONENTES QUE SEAN STANDALONE:true'
// })
// export class HomePage {
//   afAuth : AngularFireAuth;  
//   constructor(private angularFireAuth: AngularFireAuth) {
//     this.afAuth = angularFireAuth;
//   }


// ¿Como saber si el usuario esta logueado?

//   FORMA 1---------------------------------------------------------
//   afAuth : AngularFireAuth;  
//   constructor(private angularFireAuth: AngularFireAuth) {
//     this.afAuth = angularFireAuth;
//   }
//   <div *ngIf="(afAuth.user | async)"></div>



//   FORMA 2-------------------------------------------------------
//   usuarioLogueado : boolean = false;
//   //Metodo sirve, pero no lo puedo estar llamando a cada instante.
//   usuarioEstaLogueado(){
//     this.angularFireAuth.authState.subscribe(user => {
//       //' !! ': Convierte a la variable en booleano. Si es null o undefined, es FALSE, caso contrario TRUE.
//       this.usuarioLogueado = !!user; //Null o undefined = No hay usuario logueado = false.
//     });
//   }

// }

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { IonicModule } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
//IMPORTAR
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
  // providers: [Flashlight] //AGREGO ESTO
})
export class HomePage implements OnInit {
  //INYECTO
  constructor(private loginService: LoginService, private router: Router, public loadingController: LoadingController) { }
  ngOnInit() { }
  async logout() {
    const loading = await this.presentLoading();

    setTimeout(() => {
      this.loginService.desloguear();
      this.router.navigate(['/login']);
      loading.dismiss();
    }, 2000);

  }

  facil() {
    this.router.navigate(['/facil']);
  }

  medio() {
    this.router.navigate(['/medio']);

  }

  dificil() {
    this.router.navigate(['/dificil']);

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      spinner: 'dots',
      translucent: true,
      cssClass: 'custom-class'
    });

    await loading.present();
    return loading;
  }
}
