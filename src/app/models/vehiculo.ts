import { Cliente } from "./cliente";
import { ClienteTipo } from "./clienteTipo";
import { Marca } from "./marca";
import { Modelo } from "./modelo";

export class Vehiculo{
    id?: number;
    tipoVehiculo: string;
    marca: Marca;
    modelo: Modelo;
    placas: string;
    serie: string;
    color: string;
    ano:number;
    cliente: number;
    eliminado: number;

    constructor(tipoVehiculo: string,marca: Marca,modelo: Modelo,placas: string,serie: string,color: string,
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