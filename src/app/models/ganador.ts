export class Ganador {
    usuario: string = '';
    fecha: Date = new Date();
    segundos: number = 0;
    milisegundos: number = 0;
    id : string = '';

    constructor(usuario: string, fecha: Date, segundos: number, milisegundos: number, id : string) {
        this.usuario = usuario;
        this.fecha = fecha;
        this.segundos = segundos;
        this.milisegundos = milisegundos;
        this.id = id;
    }
}