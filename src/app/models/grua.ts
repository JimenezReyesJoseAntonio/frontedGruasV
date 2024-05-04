import { EstatusGruaDto } from "./estatusGrua.dto";

export class Grua{
    noEco?: number;
    placa: string;
    serie: string;
    noPermiso: string;
    aseguradora: string;
    noPoliza:string;
    ano:number;
    kilometraje: number;
    eliminado: number;

    constructor(placa:string,serie:string,noPermiso:string,aseguradora:string,noPoliza:string,ano:number,
        kilometraje:number,eliminado:number){
            this.placa = placa;
            this.serie = serie;
            this.noPermiso = noPermiso;
            this.aseguradora = aseguradora;
            this.noPoliza = noPoliza;
            this.ano = ano;
            this.kilometraje = kilometraje;
            this.eliminado = eliminado;

    }


}