import { Component, OnInit } from '@angular/core';
import { Grua } from '../../models/grua';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstatusGruaDto } from '../../models/estatusGrua.dto';
import { MessageService } from 'primeng/api';
import { GruaService } from '../../services/grua.service';
import { EstatusGruaService } from '../../services/estatus-grua.service';

@Component({
  selector: 'app-grua',
  templateUrl: './grua.component.html',
  styleUrl: './grua.component.css',
  providers: [MessageService]

})
export class GruaComponent implements OnInit {
  gruas: Grua[] = [];
  listaVacia: string | undefined;
  gruaForm!: FormGroup;

  //estatus del operador
  estatus: EstatusGruaDto[] = [];
  estatusDropdown: any[] = []; // Declaración de la variable estatusDropdown
  selectedEstatusId: number | null = null;


  grua: Grua | null = null;
  editingOperador: Grua | null = null;

  productDialog: boolean = false;
  updateDialog: boolean = false;
  deleteOperadorDialog: boolean = false;

  constructor(
    private messageService: MessageService,
    private gruaService: GruaService,
    private fb: FormBuilder,
    private estatusGruaService: EstatusGruaService

  ) {
    this.gruaForm = this.fb.group({
      placa: [null, [Validators.required]],
      serie: [null, [Validators.required]],
      noPermiso: [null, [Validators.required]],
      aseguradora: [null, [Validators.required]],
      noPoliza: [null, [Validators.required]],
      ano: [null, [Validators.required]],
      kmSalida: [null, [Validators.required]],
      kmEntrada: [null, [Validators.required]],
      estatus: [null, [Validators.required]]


    });
  }


  ngOnInit(): void {

   this.cargarOperadores();
   this.cargarEstatus();


  }


  cargarOperadores(): void {
    console.log('carga operadores' + this.gruas.length)

    this.gruaService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.gruas = data;

        this.listaVacia = undefined;
      },
      err => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar operadores';
        }
      }
    );
  }

  cargarEstatus(): void {

    this.estatusGruaService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.estatus = data;
        this.estatusDropdown = this.formatoDropdown(data); // Convertir el formato

        console.log(data);
        console.log('carga estatus' + this.estatus.length)

      },
      err => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar estatus';
        }
      }
    );
  }

  registrarOperador(): void {
    console.log(this.gruaForm.valid);
    console.log(this.gruaForm);

    if (this.gruaForm.valid) {
      console.log(this.gruaForm.value);

      const formData = this.gruaForm.value;
      this.gruaService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operador registrado exitosamente' });
          // Limpiar los campos del formulario u otras acciones necesarias
          this.cargarOperadores(); // Recargar la lista de operadores después de agregar uno nuevo
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
    this.gruaForm.reset();
    this.productDialog = true;
  }

  deleteOperador(grua: Grua) {
    this.grua = grua;
    this.deleteOperadorDialog = true;
  }

  deleteSelectedOperador() {
    this.deleteOperadorDialog = true;
  }


  confirmDeleteOperador(): void {
    console.log(this.grua.noEco);
    if (this.grua) {
      this.gruaService.delete(this.grua.noEco).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operador eliminado exitosamente' });
          this.grua = null;
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

  editOperador(grua: Grua) {
    this.editingOperador = { ...grua }; // Clonar el operador para evitar modificar el original directamente
    console.log(typeof this.editingOperador.estatus)
    this.updateDialog = true; // Mostrar el diálogo de edición
  }

  editOperadorConfirm() {
    if (this.gruaForm.valid && this.editingOperador) {
      this.gruaService.update(this.editingOperador.noEco, this.editingOperador).subscribe(
        () => {
          // Operador actualizado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operador actualizado exitosamente' });
          this.gruaForm.reset();
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

  //formato de los estatus para usarlo en el droptown
  formatoDropdown(estatus: EstatusGruaDto[]): any[] {
    return estatus.map(item => ({ label: item.descripcion, value: item.id }));
  }

  // cambia el color del tag
  getSeverity(status: string) {
    switch (status) {
      case 'Libre':
        return 'success';
      case 'Ocupada':
        return 'warning';
      case 'Fuera de servicio':
        return 'danger';
      default:
        return ''; // Handle other cases, such as returning an empty string
    }
  }
}
