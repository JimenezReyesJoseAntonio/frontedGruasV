export class Modelo{
    id: number;
    nombre: string;
    marcaId: number;
    eliminado: number;


    constructor( nombre:string,  marcaId: number, eliminado: number

    ){
        this.nombre = nombre;
        this.marcaId = marcaId;
        this.eliminado= eliminado;


    }

}