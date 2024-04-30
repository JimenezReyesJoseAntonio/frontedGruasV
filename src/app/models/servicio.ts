export class Servicio {

    folioServicio: string;
    fecha: Date;
    ubicacionSalida: string;
    ubicacionContacto: string;
    montoCobrado: number;
    observaciones: string;
    ubicacionTermino: string;
    estadoServicio: string;
    cliente: number;
    vehiculo: number;
    operador: number;
    grua: number;
    usuario: number;
    eliminado: number;

    constructor(folioServicio: string, fecha: Date, ubicacionSalida: string, ubicacionContacto: string,
        montoCobrado: number, observaciones: string, ubicacionTermino: string, estadoServicio: string, cliente: number,
        vehiculo: number, operador: number, grua: number, usuario: number, eliminado: number
    ) {

        this.folioServicio = folioServicio;
        this.fecha = fecha;
        this.ubicacionSalida = ubicacionSalida;
        this.ubicacionContacto = ubicacionContacto;
        this.montoCobrado = montoCobrado;
        this.observaciones = observaciones;
        this.ubicacionTermino = ubicacionTermino;
        this.estadoServicio = estadoServicio;
        this.cliente = cliente;
        this.vehiculo = vehiculo;
        this.operador = operador;
        this.grua = grua;
        this.usuario = usuario;
        this.eliminado = eliminado;
    }
}