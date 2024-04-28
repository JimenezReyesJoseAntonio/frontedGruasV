import { ClienteTipo } from "./clienteTipo";

export class Cliente{
    numTelefono:string;
    clienteTipo:number;

    constructor(numTelefono:string, clienteTipo:number){
        this.numTelefono = numTelefono;
        this.clienteTipo = clienteTipo;

    }

}