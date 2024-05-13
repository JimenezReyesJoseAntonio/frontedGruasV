import { ClienteTipo } from "./clienteTipo";

export class Cliente{
    id:number;
    numTelefono:string;
    clienteTipo:ClienteTipo;
    eliminado: number;

    constructor(numTelefono:string, clienteTipo:ClienteTipo,    eliminado: number
    ){
        this.numTelefono = numTelefono;
        this.clienteTipo = clienteTipo;
        this.eliminado= eliminado;

    }

}