export class ClienteTipo {
    id: number;
    nombreCliente: string;
    eliminado: number;


    constructor(nombreCliente: string,    eliminado: number) {
        this.nombreCliente = nombreCliente;
        this.eliminado= eliminado;


    }
 

}