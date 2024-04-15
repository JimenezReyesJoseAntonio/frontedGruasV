import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Operador } from '../../models/operador';
import { OperadorService } from '../../services/operador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstatusDto } from '../../models/estatus.dto';
import { EstatusService } from '../../services/estatus.service';

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrl: './operador.component.css',
  providers: [MessageService],
})
export class OperadorComponent implements OnInit {
  operadores: Operador[] = [];
  listaVacia: string | undefined;
  operadorForm!: FormGroup;

  //estatus del operador
  estatus: EstatusDto[] = [];
  estatusDropdown: any[] = []; // Declaración de la variable estatusDropdown
  selectedEstatusId: number | null = null;

  operador: Operador | null = null;
  editingOperador: Operador | null = null;

  operadorDialog: boolean = false;
  updateDialog: boolean = false;
  deleteOperadorDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private operadorService: OperadorService,
    private fb: FormBuilder,
    private estatusService: EstatusService
  ) {
    this.operadorForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      apellidoMaterno: [null, [Validators.required]],
      numTelefono: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      curp: [null, [Validators.required]],
      nss: [null, [Validators.required]],
      direccion: [null, [Validators.required]],
      codigoPostal: [null, [Validators.required]],
      licencia: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarOperadores();
    this.cargarEstatus();
  }

  cargarOperadores(): void {
    console.log('carga operadores' + this.operadores.length);

    this.operadorService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.operadores = data;

        this.listaVacia = undefined;
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar operadores';
        }
      }
    );
  }

  cargarEstatus(): void {
    this.estatusService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.estatus = data;
        //filtrar solo los que no estan elimnados
        this.estatus = this.estatus.filter((est) => est.eliminado === 0);
        //agregarlos al dropdown
        this.estatusDropdown = this.formatoDropdown(this.estatus); // Convertir el formato

        console.log(data);
        console.log('carga estatus' + this.estatus.length);
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar estatus';
        }
      }
    );
  }

  registrarOperador(): void {
    this.submitted = true;

    console.log(this.operadorForm.valid);
    console.log(this.operadorForm);
    this.operador = this.operadorForm.value;
    if (this.operadorForm.valid) {
      console.log(this.operadorForm.value);

      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const nombreValue = this.operadorForm.get('nombre')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.operadorForm.get('nombre')?.setValue(nombreValue);

      const formData = { ...this.operadorForm.value }; // Clonar el objeto para no modificar el original

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formData)) {
        const value = formData[key];
        if (typeof value === 'string') {
          formData[key] = value.toUpperCase();
        }
      }

      this.operadorService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Operador registrado exitosamente',
          });
          // Limpiar los campos del formulario u otras acciones necesarias
          this.cargarOperadores(); // Recargar la lista de operadores después de agregar uno nuevo
          this.operadorDialog = false;
        },
        (error) => {
          // Error al registrar el operador
          console.error('Error:', error);
          console.log('entre');

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
        detail: 'Campos vacios',
      });
    }
  }

  hideDialog() {
    this.operadorDialog = false;
  }

  showDialog() {
    this.operadorForm.reset();
    this.submitted = false;
    this.operadorDialog = true;
  }

  deleteOperador(operador: Operador) {
    this.operador = operador;
    this.deleteOperadorDialog = true;
  }

  deleteSelectedOperador() {
    this.deleteOperadorDialog = true;
  }

  confirmDeleteOperador(): void {
    console.log(this.operador.nombre);
    if (this.operador) {
      this.operadorService.delete(this.operador.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Operador eliminado exitosamente',
          });
          this.operador = null;
          this.cargarOperadores(); // Recargar la lista de operadores después de eliminar
          this.deleteOperadorDialog = false;
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

  editOperador(operador: Operador) {
    this.editingOperador = { ...operador }; // Clonar el operador para evitar modificar el original directamente
    console.log(typeof this.editingOperador.estatus);
    this.submitted = true; // para que los small aparezcan cuando se borren y no cuando se manden
    this.updateDialog = true; // Mostrar el diálogo de edición
  }

  editOperadorConfirm() {
    if (this.operadorForm.valid && this.editingOperador) {
      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const nombreValue = this.operadorForm.get('nombre')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.operadorForm.get('nombre')?.setValue(nombreValue);

      const formValues = this.operadorForm.value;

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }

      this.operadorService
        .update(this.editingOperador.id, formValues)
        .subscribe(
          () => {
            // Operador actualizado exitosamente
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Operador actualizado exitosamente',
            });
            this.operadorForm.reset();
            this.updateDialog = false; // Cerrar el diálogo de edición
            this.cargarOperadores();
            this.editingOperador = null; // Limpiar el operador en edición
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

  //formato de los estatus para usarlo en el d
  formatoDropdown(estatus: EstatusDto[]): any[] {
    return estatus.map((item) => ({ label: item.descripcion, value: item.id }));
  }

  // cambia el color del tag
  getSeverity(status: string) {
    switch (status) {
      case 'Libre':
        return 'success';
      case 'Ocupapdo':
        return 'warning';
      case 'Permiso':
        return 'danger';
      default:
        return ''; // Handle other cases, such as returning an empty string
    }
  }
}
