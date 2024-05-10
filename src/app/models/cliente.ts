import { ClienteTipo } from "./clienteTipo";

export class Cliente{
    id:number;
    numTelefono:string;
    clienteTipo:number;
    eliminado: number;

    constructor(numTelefono:string, clienteTipo:number,    eliminado: number
    ){
        this.numTelefono = numTelefono;
        this.clienteTipo = clienteTipo;
        this.eliminado= eliminado;

    }

}