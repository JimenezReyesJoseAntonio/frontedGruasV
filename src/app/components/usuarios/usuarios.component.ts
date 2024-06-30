import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  providers: [MessageService]

})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuario: Usuario | null = null;
  listaVacia: string | undefined;
  usuarioForm:FormGroup;
  usuarioDialog:boolean= false;

  constructor(
   private usuarioService: UsuariosService,
   private fb: FormBuilder,
   private messageService: MessageService,
   private authService: AuthService,


  ) {
    this.usuarioForm = this.fb.group({
      nombre: [null, [Validators.required]],
      nombreUsuario:[null, [Validators.required]],
      email:[null, [Validators.required]],
      password:[null, [Validators.required]]


    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  @ViewChild('dtUsuario') dtModelo!: Table;

  cargarUsuarios() {
    this.usuarioService.lista().subscribe(
      (data) => {
        this.usuarios = data;
       // this.marcas = this.marcas.filter(est => est.eliminado === 0);
        console.log(data);
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar marcas';
        }
      }
    );
  }

  nuevoDialog(){
    this.usuarioForm.reset();
    this.usuarioDialog= true;


  }

  crearUsuario(){
    console.log(this.usuarioForm.valid);

    console.log(this.usuarioForm.value);
    if(this.usuarioForm.valid){
      const formData = { ...this.usuarioForm.value }; // Clonar el objeto para no modificar el original
      this.usuario = new Usuario(formData.nombre,formData.nombreUsuario,formData.email,formData.password);

      this.authService.nuevo(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado exitosamente' });

          // Limpiar los campos del formulario u otras acciones necesarias
          this.cargarUsuarios(); // Recargar la lista de usuario después de agregar uno nuevo
          this.usuarioDialog = false;

        },
        error => {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );

    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacios' });

    }
  }

  applyFilterGlobal(event: Event, dt: Table) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
  }


}
