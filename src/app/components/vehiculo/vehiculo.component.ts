import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { Marca } from '../../models/marca';
import { Modelo } from '../../models/modelo';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css',
  providers: [MessageService]

})
export class VehiculoComponent implements OnInit {
  marca: Marca | null = null;
  modelo: Modelo | null = null;
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  marcaUp: Marca | null = null;
  marcaDel: Marca | null = null;
  modeloUp: Modelo | null = null;
  modeloDel: Modelo | null = null;
  listaVacia: string | undefined;
  marcaDialog:boolean = false;
  modeloDialog:boolean = false;
  updatemarcaDialog:boolean = false;
  updatemodeloDialog:boolean = false;
  deleteMarcaDialog:boolean = false;
  deleteModeloDialog:boolean = false;
  marcaForm: FormGroup;
  modeloForm:FormGroup;


  ngOnInit(): void {

  }

  
  constructor(
    private messageService: MessageService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private fb: FormBuilder,

  ) {
    this.modeloForm = this.fb.group({
      nombre: [null, [Validators.required]],
      marcaId:[null, [Validators.required]]

    });

    this.marcaForm = this.fb.group({
      nombre: [null, [Validators.required]]
     });

    this.cargarMarcas();
    this.cargarModelos();

  }

  cargarMarcas() {
    this.marcaService.lista().subscribe(
      (data) => {
        this.marcas = data;
        this.marcas = this.marcas.filter(est => est.eliminado === 0);
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

  cargarModelos() {
    this.modeloService.lista().subscribe(
      (data) => {
        this.modelos = data;
        this.modelos = this.modelos.filter(est => est.eliminado === 0);
        console.log(data);
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar modelos';
        }
      }
    );
  }

  registrarMarca(): void{
   // this.marca = this.marcaForm.value;

    if (this.marcaForm.valid) {
      console.log(this.marcaForm.value);

      const formData = { ...this.marcaForm.value }; // Clonar el objeto para no modificar el original
      this.convertirCamposMayusculas(formData);
      this.marca = new Marca(formData.nombre,0);
      //const formData = this.gruaForm.value;
      this.marcaService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Marca registrada exitosamente' });
          this.marcaForm.reset();
          this.cargarMarcas();
          this.marcaDialog = false;

        },
        error => {
          // Error al registrar el operador
          console.error('Error:', error);
          console.log('entre');
          this.marcaForm.reset();

          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacios' });

    }
  }

  convertirCamposMayusculas(formData: any) {
    for (const key of Object.keys(formData)) {
      const value = formData[key];
      if (typeof value === 'string') {
        formData[key] = value.toUpperCase();
      }
    }
  }

  registrarModelo(): void{
   // this.modelo = this.modeloForm.value;

    if (this.modeloForm.valid) {
      console.log(this.modeloForm.value);

      const formData = { ...this.modeloForm.value }; // Clonar el objeto para no modificar el original
      this.convertirCamposMayusculas(formData);
      this.modelo = new Modelo(formData.nombre,formData.marcaId.id,0);
     console.log('h'+formData.marcaId.id);
     
      //const formData = this.gruaForm.value;
      
      this.modeloService.save(this.modelo).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Modelo registrado exitosamente' });
          this.modeloForm.reset();
          this.cargarModelos();
          this.modeloDialog = false;


        },
        error => {
          // Error al registrar el operador
          console.error('Error:', error);
          console.log('entre');
          this.modeloForm.reset();

          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );
      
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacios' });

    }
  }

  showDialog() {
    this.marcaDialog = true;
  }

  hideDialog() {
    this.marcaDialog = false;
  }

  showDialogMo() {
    this.modeloDialog = true;
  }

  hideDialogMo() {
    this.modeloDialog = false;
  }


  updateMarca(marca:Marca){
    this.marcaUp = { ...marca }; // Clonar la marca para evitar modificar el original directamente
    console.log(this.marcaUp.nombre);
    this.updatemarcaDialog= true; // Mostrar el diálogo de edición
  }

  updateModelo(modelo:Modelo){
    this.modeloUp = { ...modelo }; // Clonar el modelo para evitar modificar el original directamente
    console.log( this.modeloUp.nombre);
    this.updatemodeloDialog= true; // Mostrar el diálogo de edición
  }

  updateMarcaConfirm(){
    if (this.marcaUp && this.marcaForm.valid ) {
      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const nombreValue = this.marcaForm.get('nombre')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.marcaForm.get('nombre')?.setValue(nombreValue);

      const formValues = this.marcaForm.value;

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }

      this.marcaService
        .update(this.marcaUp.id, formValues)
        .subscribe(
          () => {
            // Operador actualizado exitosamente
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Marca actualizada exitosamente',
            });
            this.marcaForm.reset();
            this.updatemarcaDialog = false; // Cerrar el diálogo de edición
            this.cargarMarcas();
            this.marcaUp = null; // Limpiar la marca en edición
          },
          (error) => {
            // Error al actualizar la marca
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

  updateModeloConfirm(){
    if (this.modeloUp && this.modeloUp.nombre != '') {
      // Obtener el valor del campo 'nombre' y eliminar espacios en blanco al principio y al final
      const nombreValue = this.modeloForm.get('nombre')?.value.trim();

      // Actualizar el valor del campo 'nombre' en el formulario
      this.modeloForm.get('nombre')?.setValue(nombreValue);

      const formValues = this.modeloForm.value;

      // Convertir campos a mayúsculas
      for (const key of Object.keys(formValues)) {
        const value = formValues[key];
        if (typeof value === 'string') {
          formValues[key] = value.toUpperCase();
        }
      }

      this.modeloService
        .update(this.modeloUp.id, formValues)
        .subscribe(
          () => {
            // Operador actualizado exitosamente
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Modelo actualizado exitosamente',
            });
            this.modeloForm.reset();
            this.updatemodeloDialog = false; // Cerrar el diálogo de edición
            this.cargarModelos();
            this.modeloUp = null; // Limpiar la marca en edición
          },
          (error) => {
            // Error al actualizar la marca
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

  deleteMarca(marca:Marca){
    this.marcaDel = marca;
    this.deleteMarcaDialog= true;
    console.log('marca'+marca.id);
  }

  deleteModelo(modelo:Modelo){
    this.modeloDel = modelo;
    this.deleteModeloDialog= true;
    console.log('marca'+modelo.id);
  } 

  confirmDeleteMarca(){
    console.log(this.marcaDel.nombre);
    if (this.marcaDel) {
      this.marcaService.delete(this.marcaDel.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Marca eliminada exitosamente',
          });
          this.marcaDel = null;
          this.cargarMarcas(); // Recargar la lista de operadores después de eliminar
          this.deleteMarcaDialog = false;
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

  confirmDeleteModelo(){
    console.log(this.modeloDel.nombre);
    if (this.modeloDel) {
      this.modeloService.delete(this.modeloDel.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Modelo eliminado exitosamente',
          });
          this.modeloDel = null;
          this.cargarModelos(); // Recargar la lista de operadores después de eliminar
          this.deleteModeloDialog = false;
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

}
