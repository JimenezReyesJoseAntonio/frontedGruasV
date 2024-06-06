import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteTipo } from '../../models/clienteTipo';
import { MessageService } from 'primeng/api';
import { ClienteTipoService } from '../../services/clienteTipo.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
  providers: [MessageService]

})
export class ClienteComponent implements OnInit {
  clientForm: FormGroup;
  clientes: ClienteTipo[] = [];
  cliente: ClienteTipo | null = null;
  clienteDel: ClienteTipo | null = null;
  clienteUp: ClienteTipo | null = null;

  clienteDialog: boolean = false;
  clienteSearch: boolean = false;
  enaNuevo: boolean = false;
  listaVacia: string | undefined;
  loading: boolean = false;
  deleteClienteDialog: boolean = false;
  updateDialog:boolean = false;

  @ViewChild('dt2') dt2!: Table;

  constructor(
    private messageService: MessageService,
    private clienteService: ClienteTipoService,
    private fb: FormBuilder,

  ) {
    this.clientForm = this.fb.group({
      nombreCliente: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

 cargarClientes(): void {
    console.log('carga cientes' + this.clientes.length);
    this.clienteService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.clientes = data;
        //filtramos solo las gruas que no han sido borrados
        this.clientes = this.clientes.filter(cliente => cliente.eliminado === 0);
        this.listaVacia = undefined;
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar clientes';
        }
      }
    );
  }



  registrarCliente(): void{
   
    this.cliente = this.clientForm.value;

    if (this.clientForm.valid) {
      console.log(this.clientForm.value);
      //const formData = this.gruaForm.value;
      const formValues = this.clientForm.value;

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }
      
      this.clienteService.save(formValues).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente registrado exitosamente' });
          this.clientForm.reset();
          this.clienteDialog = false;
          this.cargarClientes();
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

  deleteCliente(cliente:ClienteTipo){
    this.clienteDel = cliente;
    this.deleteClienteDialog= true;
    console.log('cliente'+cliente.id);
  }

  confirmDeleteCliente(){
    console.log(this.clienteDel.nombreCliente);
    if (this.clienteDel) {
      this.clienteService.delete(this.clienteDel.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado exitosamente',
          });
          this.clienteDel = null;
          this.cargarClientes(); // Recargar la lista de operadores después de eliminar
          this.deleteClienteDialog = false;
        },
        (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
    }
  }

  updateCliente(cliente:ClienteTipo){
    this.clienteUp = { ...cliente }; // Clonar el operador para evitar modificar el original directamente
    console.log(typeof this.clienteUp.nombreCliente);
    this.updateDialog = true; // Mostrar el diálogo de edición

  }

  updateClientConfirm(){
    if (this.clienteUp) {
      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
     // const nombreValue = this.operadorForm.get('nombre')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
     // this.operadorForm.get('nombre')?.setValue(nombreValue);

      const formValues = this.clientForm.value;

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }

      this.clienteService
        .update(this.clienteUp.id, formValues)
        .subscribe(
          () => {
            // Operador actualizado exitosamente
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Operador actualizado exitosamente',
            });
            this.clientForm.reset();
            this.updateDialog = false; // Cerrar el diálogo de edición
            this.cargarClientes();
            this.clienteUp = null; // Limpiar el operador en edición
          },
          (error) => {
            // Error al actualizar el operador
            console.error('Error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Campos vacíos o inválidos',
      });
    }
  }

  applyFilterGlobal(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.dt2.filterGlobal(inputElement.value, 'contains');
  }

  showDialog() {
    this.clienteDialog = true;
  }

  showSearch(){
    this.clienteSearch = true;
    this.enaNuevo = true;
  }
  
  hideDialog() {
    this.clienteDialog = false;
  }

}
