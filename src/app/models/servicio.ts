export class Servicio{

    folioServicio: string;
    fecha: Date;
    ubicacionSalida: string;
    ubicacionContacto: string;
    montoCobrado: number;
    observaciones: string;
    ubicacionTermino: string;
    estadoServicio: string;
    operador: number;
    grua:number;
    eliminado: number;

    constructor( folioServicio: string,fecha: Date,ubicacionSalida: string,ubicacionContacto: string,
        montoCobrado: number,observaciones: string,ubicacionTermino: string,estadoServicio: string,eliminado: number,
        operador: number,grua:number
    ){

        this.folioServicio= folioServicio;
        this.fecha = fecha;
        this.ubicacionSalida = ubicacionSalida;
        this.ubicacionContacto= ubicacionContacto;
        this.montoCobrado= montoCobrado;
        this.observaciones= observaciones;
        this.ubicacionTermino= ubicacionTermino;
        this.estadoServicio = estadoServicio;
        this.operador = operador;
        this.grua = grua;
        this.eliminado = eliminado;
    }
}