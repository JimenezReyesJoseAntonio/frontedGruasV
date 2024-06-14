import { Modelo } from "./modelo";

export class Marca{
    id: number;
    nombre: string;
    eliminado: number;

    constructor( nombre:string,eliminado: number

    ){
        this.nombre = nombre;
        this.eliminado= eliminado;

    }

}