import { EstatusDto } from "./estatus.dto";

export class Operador{
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numTelefono: string;
    rfc:string;
    curp:string;
    nss:string;
    direccion: string;
    codigoPostal: number;
    licencia: string;
    estatus: EstatusDto;
    eliminado: number;

    constructor(nombre: string, apellidoPaterno: string, apellidoMaterno:string, numTelefono:string,rfc:string, curp:string,
        nss:string,direccion:string,codigoPostal:number,licencia:string,estatus:EstatusDto, eliminado:number) {
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.numTelefono = numTelefono;
        this.rfc = rfc;
        this.curp = curp;
        this.nss = nss;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.licencia = licencia;
        this.estatus = estatus;
        this.eliminado = eliminado;

    }

    
    }