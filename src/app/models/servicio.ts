import { Cliente } from "./cliente";
import { Grua } from "./grua";
import { Operador } from "./operador";
import { Vehiculo } from "./vehiculo";

export class Servicio {
    id:number;
    folioServicio?: string;
    fecha: string;
    ubicacionSalida: string;
    ubicacionContacto: string;
    montoCobrado: number;
    observaciones: string;
    ubicacionTermino: string;
    estadoServicio: string;
    cliente: Cliente;
    vehiculo: Vehiculo;
    operador:Operador ;
    grua: Grua;
    usuario: number;
    eliminado: number;

    constructor(folioServicio: string, fecha: string, ubicacionSalida: string, ubicacionContacto: string,
        montoCobrado: number, observaciones: string, ubicacionTermino: string, estadoServicio: string, cliente: Cliente,
        vehiculo: Vehiculo, operador: Operador, grua: Grua, usuario: number, eliminado: number
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