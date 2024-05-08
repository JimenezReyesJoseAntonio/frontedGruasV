import { Modelo } from "./modelo";

export class Marca{
    id: number;
    nombre: string;
    marcaId: number;

    constructor(id:number, nombre:string,  marcaId: number
    ){
        this.id = id;
        this.nombre = nombre;
        this.marcaId = marcaId;

    }

}