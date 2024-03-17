import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Operador } from '../../models/operador';
import { OperadorService } from '../../services/operador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrl: './operador.component.css',
  providers: [MessageService]

})
export class OperadorComponent implements OnInit{
  operadores: Operador[] = [];
  listaVacia: string | undefined;
  operadorForm!: FormGroup;
  

  operador: Operador | null = null;
  editingOperador: Operador | null = null;

  productDialog: boolean = false;
  updateDialog: boolean = false;
  deleteOperadorDialog: boolean = false; 

  constructor(private messageService: MessageService,
    private operadorService: OperadorService,
    private fb:FormBuilder,

    ) {
      this.operadorForm =this.fb.group({
        nombre:[null,[Validators.required]],
        apellidoPaterno:[null,[Validators.required]],
        apellidoMaterno:[null,[Validators.required]],
        numTelefono:[null,[Validators.required]],
        rfc:[null,[Validators.required]],
        curp:[null,[Validators.required]],
        nss:[null,[Validators.required]],
        direccion:[null,[Validators.required]],
        codigoPostal:[null,[Validators.required]],
        puesto:[null,[Validators.required]],
        licencia:[null,[Validators.required]],
        residencia:[null,[Validators.required]],


        });
    }


  ngOnInit(): void {

    this.cargarOperadores();

  }


  cargarOperadores(): void {
    console.log('carga operadores' + this.operadores.length)

    this.operadorService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.operadores = data;

        this.listaVacia = undefined;
      },
      err => {
        this.listaVacia = err.error.message;
      }
    );
  }

  registrarOperador(): void {
    console.log(this.operadorForm .valid);
    if (this.operadorForm .valid) {
      console.log(this.operadorForm.value);
      this.operadorService.save(this.operadorForm.value).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operador registrado exitosamente' });
          // Limpiar los campos del formulario u otras acciones necesarias
          this.productDialog = false;
  
        },
        error => {
          // Error al registrar el operador
          console.error('Error:', error);
          console.log('entre');

          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacios' });

    }

    

  }
  
  hideDialog() {
    this.productDialog = false;
}

  showDialog() {
    this.productDialog = true;
  }

  updatetable(){
    this.cargarOperadores();
  }

 

deleteOperador(operador:Operador){
  this.operador = operador;
  this.deleteOperadorDialog = true;
}

deleteSelectedOperador() {
  this.deleteOperadorDialog = true;
}


confirmDeleteOperador():void{
  console.log(this.operador.nombre);
  if (this.operador) {
    this.operadorService.delete(this.operador.id).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operador eliminado exitosamente' });
        this.operador = null;
        this.cargarOperadores(); // Recargar la lista de operadores después de eliminar
        this.deleteOperadorDialog = false;
      },
      error => {
        console.error('Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    );
  }

}

editOperador(operador: Operador) {
  this.editingOperador = { ...operador }; // Clonar el operador para evitar modificar el original directamente
  this.updateDialog = true; // Mostrar el diálogo de edición
}

editOperadorConfirm(){
  if (this.operadorForm.valid && this.editingOperador) {
    this.operadorService.update(this.editingOperador.id,this.editingOperador).subscribe(
      () => {
        // Operador actualizado exitosamente
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operador actualizado exitosamente' });
        this.updateDialog = false; // Cerrar el diálogo de edición
        this.cargarOperadores();
        this.editingOperador = null; // Limpiar el operador en edición
      },
      error => {
        // Error al actualizar el operador
        console.error('Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    );
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacíos o inválidos' });
  }
}

}
