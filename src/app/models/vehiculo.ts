import { ClienteTipo } from "./clienteTipo";

export class Vehiculo{
    id?: number;
    tipoVehiculo: string;
    marca: string;
    modelo: string;
    placas: string;
    serie: string;
    color: string;
    ano:number;
    cliente: number;
    eliminado: number;

    constructor(tipoVehiculo: string,marca: string,modelo: string,placas: string,serie: string,color: string,
        ano:number,cliente: number, eliminado: number
    ){
        this.tipoVehiculo= tipoVehiculo;
        this.marca = marca;
        this.modelo = modelo;
        this.placas = placas;
        this.serie = serie;
        this.color = color;
        this.ano = ano;
        this.cliente = cliente;
        this.eliminado=eliminado;
    }



}