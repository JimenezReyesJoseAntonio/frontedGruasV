import { ClienteTipo } from "./clienteTipo";

export class Cliente{
    numTelefono:string;
    clienteTipo:ClienteTipo;

    constructor(numTelefono:string, clienteTipo:ClienteTipo){
        this.numTelefono = numTelefono;
        this.clienteTipo = clienteTipo;

    }

}