
export class Usuario{
    id: number;
    nombre: string;
    nombreUsuario: string;
    email: string;
    password: string;
    eliminado: number;


    constructor(nombre:string,nombreUsuario:string,email:string,password:string, eliminado: number
        ){
            this.nombre = nombre;
            this.nombreUsuario = nombreUsuario;
            this.email = email;
            this.password = password;
            this.eliminado = eliminado;

    }


}