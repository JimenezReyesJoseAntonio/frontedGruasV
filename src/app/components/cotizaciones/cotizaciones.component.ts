import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposVehiculoService } from '../../services/tipos-vehiculo.service';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { Marca } from '../../models/marca';
import { Modelo } from '../../models/modelo';
import { TiposVehiculo } from '../../models/tiposVehiculo';
import { Cotizacion } from '../../models/cotizacion';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { MessageService } from 'primeng/api';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/vehiculo';
import moment from 'moment';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.css',
  providers: [MessageService],

})
export class CotizacionesComponent implements OnInit {

  cotizacionForm: FormGroup;

  selectedMarca: any;
  modelosFiltrados: any[] = [];
  selectedModelo: any;
  marcas: Marca[] = [];
  cotizaciones: Cotizacion[] = [];
  modelos: Modelo[] = [];
  listaVacia: string | undefined;
  tiposVehiculo: TiposVehiculo[] = [];
  cotizacion: Cotizacion | null = null;

  cotizacionDialog: boolean = false;
  idUser: number;


  constructor(
    public router: Router,
    private fb: FormBuilder,
    private tiposVService: TiposVehiculoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private cotizacionService: CotizacionesService,
    private messageService: MessageService,
    private vehiculoService: VehiculoService,
    private tokenService: TokenService,

  ){

    this.cotizacionForm = this.fb.group({
      monto: ['', Validators.required],
      ubicacionContacto: ['', Validators.required],
      ubicacionTermino: ['', Validators.required],
      numTelefono: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
      marca: [''],
      modelo: [''],
      placas: [''],
      serie: [''],
      poliza: [''],
      color: [''],
      ano: [''],
    });

  }
  ngOnInit(): void {
    this.cargarMarcas();
    this.cargarModelos();
    this.cargarTiposVehiculo();
    this.idUser = this.tokenService.getIdUsuario();
    this.cargarCotizaciones();
  }

  showDialog() {
    this.cotizacionForm.reset();
    this.cotizacionDialog = true;
    this.selectedMarca = null;
    this.selectedModelo= null;

  }

  cargarCotizaciones() {
    this.cotizacionService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.cotizaciones = data;
        //this.clientes = this.clientes.filter(est => est.eliminado === 0);
        console.log(data);
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar cotizaciones';
        }
      }
    );
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

  cargarModelos() {
    this.modeloService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.modelos = data;

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

  filtrarModelosPorMarca(): void {
    if (this.selectedMarca) {
      this.modelosFiltrados = this.modelos.filter(m => m.marcaId === this.selectedMarca.id);
    } else {
      this.modelosFiltrados = [];
    }
  }

  cargarTiposVehiculo() {
    this.tiposVService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.tiposVehiculo = data;
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

  onConfirmCotizacion(){
    console.log(this.cotizacionForm.valid);
    console.log(this.cotizacionForm.value);
   

    if (this.cotizacionForm.valid) {

      const formDataCotizacion = { ...this.cotizacionForm.value }; // Clonar el objeto para no modificar el original

      // Convertir campos a mayúsculas
      this.convertirCamposMayusculas(formDataCotizacion);

      this.cotizacion = formDataCotizacion;
      const fechaActual = moment().format('YYYY-MM-DD'); // Solo fecha sin hora

          const cotizacion = new Cotizacion( fechaActual,formDataCotizacion.monto,formDataCotizacion.ubicacionContacto, 
            formDataCotizacion.ubicacionTermino ,formDataCotizacion.numTelefono, this.idUser,'CREADO',formDataCotizacion.tipoVehiculo, 
            formDataCotizacion.marca?.id, formDataCotizacion.modelo?.id, formDataCotizacion.placas, formDataCotizacion.serie,formDataCotizacion.poliza, 
            formDataCotizacion.color, formDataCotizacion.ano, 0);


      this.cotizacionService.save(cotizacion).subscribe(
        (response) => {
          // Operador registrado exitosamente
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cotización registrada exitosamente',
          });
 
          const cotizacion = response;
          console.log('idOpe' + cotizacion);

          // Limpiar los campos del formulario u otras acciones necesarias
          this.cotizacionDialog = false;
          this.cargarCotizaciones();

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

  convertirCamposMayusculas(formData: any) {
    for (const key of Object.keys(formData)) {
      const value = formData[key];
      if (typeof value === 'string') {
        formData[key] = value.toUpperCase();
      }
    }
  }

  navigateToServicio() {
    this.router.navigate(['/principal/servicios/nuevo']); // Navega a la ruta '/principal/dashboard'

  }


}
