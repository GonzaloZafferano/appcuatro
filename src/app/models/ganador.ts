export class Ganador{
    usuario:string ='';
    fecha:string ='';
    minutos:number =0;
    segundos:number=0;

    constructor(usuario : string, fecha : string, minutos:number, segundos : number){
        this.usuario = usuario;
        this.fecha = fecha;
        this.minutos = minutos,
        this.segundos = segundos;
    }
}