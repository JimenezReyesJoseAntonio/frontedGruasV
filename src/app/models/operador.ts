import { EstatusDto } from "./estatus.dto";

export class Operador{
    id?: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numTelefono: string;
    rfc:string;
    curp:string;
    nss:string;
    direccion: string;
    codigoPostal: number;
    puesto: string;
    licencia: string;
    residencia: string;
    estatus: EstatusDto;

    constructor(nombre: string, apellidoPaterno: string, apellidoMaterno:string, numTelefono:string,rfc:string, curp:string,
        nss:string,direccion:string,codigoPostal:number,puesto:string,licencia:string,residencia:string,estatus:EstatusDto ) {
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.numTelefono = numTelefono;
        this.rfc = rfc;
        this.curp = curp;
        this.nss = nss;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.puesto = puesto;
        this.licencia = licencia;
        this.residencia = residencia;
        this.estatus = estatus;


    }

    
    }