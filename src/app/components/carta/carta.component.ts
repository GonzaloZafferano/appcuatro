import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss'],
  standalone : true,
})
export class CartaComponent  implements OnInit {
  @Output() OnCartaSeleccionada = new EventEmitter<any>();
  @Input() rutaImagen: string = '';
  @Input() indice: number = -1;
  @Input() frente: boolean = false;
  @Input() habilitado: boolean = true;
  rutaImagenAlReves : string = '/assets/imagenes/cartaReves.jpg';
  constructor() { }

  ngOnInit() {}

  darVuelta(){
    if(this.habilitado){
      this.frente = !this.frente;
      this.OnCartaSeleccionada.emit(this);
    }
  }
}
