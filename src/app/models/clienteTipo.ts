export class ClienteTipo {
    id: number;
    nombreCliente: string;
    rfc:string;
    eliminado: number;


    constructor(nombreCliente: string, rfc:string, eliminado: number) {
        this.nombreCliente = nombreCliente;
        this.eliminado= eliminado;
        this.rfc = rfc;

    }
 

}