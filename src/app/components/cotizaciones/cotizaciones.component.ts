import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';
import { WhatsappApiCloudService } from '../../services/whatsapp-api-cloud.service';
import { CotizacionPdfService } from '../../services/cotizacion-pdf.service';
import { MessageCarta } from '../../Whatsapp/interfaces/message-carta';
import { COMPONENT_TYPE, MESSAGING_PRODUCT, PARAMETER_TYPE, TEMPLATE_LANGUAGE, TEMPLATE_NAME, TEMPLATE_TYPE } from '../../common/api-resource';

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
  cotizacionFinish: Cotizacion | null = null;
  cotizacionMessage: Cotizacion | null = null;
  cotizacionServicio:Cotizacion | null = null;
  cotizacionDialog: boolean = false;
  finishCotizacionDialog: boolean = false;
  confirmacionServicioDialog: boolean = false;
  confirmacionMessageDialog: boolean =false;

  idUser: number;
  cotizacionUrl:string='';



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
    private whatsappService: WhatsappApiCloudService,
    private cotizacionPdf:CotizacionPdfService


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

  @ViewChild('dtCotizacion') dtModelo!: Table;

  
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
        this.cotizaciones = this.cotizaciones.filter(coti => coti.estado != 'CANCELADO' && coti.estado != 'ACEPTADO');
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

  seguirServicio(){
    const cotizacion = this.cotizacionServicio;
    const idcotizacion = cotizacion.id;
    console.log(idcotizacion);

    //cambia el estatus de la cotizacion
    this.cotizacionService.detail(idcotizacion).subscribe(
      (data) => {

        const idCoti = data.id;
        this.cambiarEstatusCotizacion(idCoti, 'estado', 'ACEPTADO');
        console.log('llega aqui' + cotizacion);
        this.navigateToServicio();

      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar el servicio';
        }
      }
    );
  }

  navigateToServicio() {
    this.router.navigate(['/principal/servicios/nuevo']); 

  }

  applyFilterGlobal(event: Event, dt: Table) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
  }

  confirmFinishCotizacion(cotizacion: Cotizacion) {
    this.finishCotizacionDialog = true; 
    this.cotizacionFinish = { ...cotizacion }; // Clonar  para evitar modificar el original directamente

  }

  confirmServicio(cotizacion:Cotizacion){
    this.confirmacionServicioDialog =true;
    this.cotizacionServicio = { ...cotizacion }; // Clonar  para evitar modificar el original directamente

  }

  confirmMensaje(cotizacion:Cotizacion){
    this.confirmacionMessageDialog =true;
    this.cotizacionMessage = { ...cotizacion }; // Clonar  para evitar modificar el original directamente
  }

  finCotizacion() {
    const cotizacion = this.cotizacionFinish;
    const idcotizacion = cotizacion.id;
    console.log(idcotizacion);

    //cambia el estatus del servicio a finalizado para liberar a los operadores y grua
    this.cotizacionService.detail(idcotizacion).subscribe(
      (data) => {

        const idCoti = data.id;
        this.cambiarEstatusCotizacion(idCoti, 'estado', 'CANCELADO');
        console.log('llega aqui' + cotizacion);

      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar el cotizacion';
        }
      }
    );
  }

  cambiarEstatusCotizacion(id: number, campo: string, nuevoValor: any) {
    this.cotizacionService.upadateEstatus(id, campo, nuevoValor).subscribe(
      () => {
        console.log('Estado asignado correctamente a la cotizacion');
        //al finalizar un servicio cargamos nuevamente los servicios
        this.cargarCotizaciones();
        this.finishCotizacionDialog = false; // Mostrar el diálogo de edición

      },
      (error) => {
        console.error('Error al asignar estado a la cotizacion:', error);
      }
    );

  }

  enviarMensajeCotizacion(){
    const cotizacion = this.cotizacionMessage;
    this.cotizacionPdf.generatePdfCotizacion(cotizacion.id).subscribe(
      response => {
        const cotizacionUrl = response.url;

        const data: MessageCarta = {
          messaging_product: MESSAGING_PRODUCT.whatsapp,
          to: '52' + cotizacion.numTelefono,
          type: TEMPLATE_TYPE.type,
          template: {
            name: TEMPLATE_NAME.operador,
            language: {
              code: TEMPLATE_LANGUAGE.es
            },
            components: [
              {
                type: COMPONENT_TYPE.header,
                parameters: [
                  {
                    type: PARAMETER_TYPE.document,
                    document: {
                      link: cotizacionUrl,
                      filename: 'Cotizacion'+cotizacion.id
                    }
                  }
                ]
              },
            ]
          }
        };

        this.whatsappService.sendMessage(data).subscribe(
          resp => {
            this.confirmacionMessageDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Mensaje enviado exitosamente' });
            console.log('se mandó el WhatsApp');
            this.cotizacionMessage = null;
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al mandar mensaje' });
            console.log(error);
          }
        );
      },
      error => {
        console.error('Error al generar el PDF:', error);
      }
    );
  }

    // cambia el color del tag
    getSeverity(status: string) {
      switch (status) {
        case 'CREADO':
          return 'success';
        case 'ACEPTADO':
          return 'warning';
        case 'CANCELADO':
          return 'danger';
        default:
          return ''; // Handle other cases, such as returning an empty string
      }
    }

}
