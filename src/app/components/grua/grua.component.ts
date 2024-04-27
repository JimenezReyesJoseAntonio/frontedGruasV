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
  editingGrua: Grua | null = null;

  gruaDialog: boolean = false;
  updateDialog: boolean = false;
  deleteGruaDialog: boolean = false;
  submitted: boolean = false;


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
      kilometraje: [null, [Validators.required]],
      estatus: [null, [Validators.required]]


    });
  }


  ngOnInit(): void {

   this.cargarGruas();
   this.cargarEstatus();


  }


  cargarGruas(): void {
    console.log('carga operadores' + this.gruas.length)

    this.gruaService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.gruas = data;

        //filtramos solo las gruas que no han sido borrados
        this.gruas = this.gruas.filter(grua => grua.eliminado === 0);


        this.listaVacia = undefined;
      },
      err => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar gruas';
        }
      }
    );
  }

  cargarEstatus(): void {

    this.estatusGruaService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.estatus = data;

        this.estatus = this.estatus.filter(est => est.eliminado === 0);

        this.estatusDropdown = this.formatoDropdown(this.estatus); // Convertir el formato

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

  registrarGrua(): void {
    this.submitted = true;

    console.log(this.gruaForm.valid);
    console.log(this.gruaForm);
    //asignamos el valor del formulario a grua para validar que el campo no este vacio, tiene que ver con el small
    this.grua = this.gruaForm.value;

    if (this.gruaForm.valid) {
      console.log(this.gruaForm.value);

      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const placaValue = this.gruaForm.get('placa')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.gruaForm.get('placa')?.setValue(placaValue);

      const aseguradoraV = this.gruaForm.get('aseguradora')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.gruaForm.get('aseguradora')?.setValue(aseguradoraV);




      const formData = { ...this.gruaForm.value }; // Clonar el objeto para no modificar el original

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formData)) {
        const value = formData[key];
        if (typeof value === 'string') {
          formData[key] = value.toUpperCase();
        }
      }

      //const formData = this.gruaForm.value;
      this.gruaService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grua registrada exitosamente' });
          // Limpiar los campos del formulario u otras acciones necesarias
          this.cargarGruas(); // Recargar la lista de operadores después de agregar uno nuevo
          this.gruaDialog = false;

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
    this.gruaDialog = false;
  }

  showDialog() {
    this.gruaForm.reset();
    this.submitted = false;
    this.gruaDialog = true;
  }

  deleteGrua(grua: Grua) {
    this.grua = grua;
    this.deleteGruaDialog = true;
  }

  deleteSelectedGrua() {
    this.deleteGruaDialog = true;
  }


  confirmDeleteGrua(): void {
    console.log(this.grua.noEco);
    if (this.grua) {
      this.gruaService.delete(this.grua.noEco).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grua eliminada exitosamente' });
          this.grua = null;
          this.cargarGruas(); // Recargar la lista de operadores después de eliminar
          this.deleteGruaDialog = false;
        },
        error => {
          console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );
    }

  }

  editGrua(grua: Grua) {
    this.editingGrua = { ...grua }; // Clonar el operador para evitar modificar el original directamente
    console.log(typeof this.editingGrua.estatus)
    this.submitted = true;
    this.updateDialog = true; // Mostrar el diálogo de edición
  }

  editGruaConfirm() {
    if (this.gruaForm.valid && this.editingGrua) {

      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const placaValue = this.gruaForm.get('placa')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.gruaForm.get('placa')?.setValue(placaValue);

      const aseguradoraV = this.gruaForm.get('aseguradora')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.gruaForm.get('aseguradora')?.setValue(aseguradoraV);

      const formValues = this.gruaForm.value;

      

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }

      this.gruaService.update(this.editingGrua.noEco, formValues).subscribe(
        () => {
          // Operador actualizado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grua actualizada exitosamente' });
          this.gruaForm.reset();
          this.updateDialog = false; // Cerrar el diálogo de edición
          this.cargarGruas();
          this.editingGrua = null; // Limpiar el operador en edición
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
