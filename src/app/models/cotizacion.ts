import { Marca } from "./marca";
import { Modelo } from "./modelo";
import { TiposVehiculo } from "./tiposVehiculo";
import { Vehiculo } from "./vehiculo";

export class Cotizacion {
    id:number;
    fecha: string;
    monto: number;
    ubicacionContacto: string;
    ubicacionTermino: string;
    numTelefono: string;
    usuario: number;
    estado: string;
    tipoVehiculo: TiposVehiculo;
    marca: Marca;
    modelo: Modelo;
    placas: string;
    serie: string;
    poliza:string;
    color: string;
    ano:number;
    eliminado: number;

    constructor( fecha: string,monto: number,  ubicacionContacto: string,
        ubicacionTermino: string, numTelefono:string, usuario: number,estado: string,
        tipoVehiculo: TiposVehiculo,marca: Marca,modelo: Modelo,placas: string,serie: string,
        poliza:string,color: string, ano:number, eliminado: number
    ) {

        this.fecha = fecha;
        this.monto = monto;
        this.ubicacionContacto = ubicacionContacto;
        this.ubicacionTermino = ubicacionTermino;
        this.numTelefono = numTelefono;
        this.usuario = usuario;
        this.estado = estado;
        this.tipoVehiculo= tipoVehiculo;
        this.marca = marca;
        this.modelo = modelo;
        this.placas = placas;
        this.serie = serie;
        this.poliza = poliza;
        this.color = color;
        this.ano = ano;
        this.eliminado = eliminado;
    }
}