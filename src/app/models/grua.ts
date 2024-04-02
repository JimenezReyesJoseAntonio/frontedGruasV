import { EstatusGruaDto } from "./estatusGrua.dto";

export class Grua{
    noEco?: number;
    placa: string;
    serie: string;
    noPermiso: string;
    aseguradora: string;
    noPoliza:string;
    ano:number;
    kmSalida: number;
    kmEntrada: number;
    estatus: EstatusGruaDto;

    constructor(placa:string,serie:string,noPermiso:string,aseguradora:string,noPoliza:string,ano:number,
        kmSalida:number,kmEntrada:number,estatus:EstatusGruaDto){
            this.placa = placa;
            this.serie = serie;
            this.noPermiso = noPermiso;
            this.aseguradora = aseguradora;
            this.noPoliza = noPoliza;
            this.ano = ano;
            this.kmSalida = kmSalida;
            this.kmEntrada = kmEntrada;
            this.estatus = estatus;



    }


}