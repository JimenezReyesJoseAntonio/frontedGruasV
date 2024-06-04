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
  listaVacia: string | undefined;


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

  }

  cargarMarcas() {
    this.marcaService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.marcas = data;

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);
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

  registrarMarca(): void{
   
    this.marca = this.marcaForm.value;

    if (this.marcaForm.valid) {
      console.log(this.marcaForm.value);

      const formData = { ...this.marcaForm.value }; // Clonar el objeto para no modificar el original
      this.convertirCamposMayusculas(formData);
     
      //const formData = this.gruaForm.value;
      this.marcaService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Marca registrada exitosamente' });
          this.marcaForm.reset();
          this.cargarMarcas();

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

  convertirCamposMayusculas(formData: any) {
    for (const key of Object.keys(formData)) {
      const value = formData[key];
      if (typeof value === 'string') {
        formData[key] = value.toUpperCase();
      }
    }
  }

  registrarModelo(): void{
   
    this.modelo = this.modeloForm.value;

    if (this.modeloForm.valid) {
      console.log(this.modeloForm.value);

      const formData = { ...this.modeloForm.value }; // Clonar el objeto para no modificar el original
      this.convertirCamposMayusculas(formData);
      this.modelo = new Modelo(formData.nombre,formData.marcaId.id);
     console.log('h'+formData.marcaId.id);
     
      //const formData = this.gruaForm.value;
      
      this.modeloService.save(this.modelo).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Modelo registrado exitosamente' });
          this.modeloForm.reset();

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



}
