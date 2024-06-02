import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from './MenuItem';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteTipo } from '../../models/clienteTipo';
import { ClienteTipoService } from '../../services/clienteTipo.service';
import { OperadorService } from '../../services/operador.service';
import { GruaService } from '../../services/grua.service';
import { Operador } from '../../models/operador';
import { Grua } from '../../models/grua';
import { Vehiculo } from '../../models/vehiculo';
import { Servicio } from '../../models/servicio';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { TokenService } from '../../services/token.service';
import { ServicioService } from '../../services/servicio.service';
import { EventService } from '../../services/event.service';
import { EstatusOperadorService } from '../../services/estatus-operador.service';
import { EstatusGruaService } from '../../services/estatus-grua.service';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { Marca } from '../../models/marca';
import { Modelo } from '../../models/modelo';
import { TransaccionService } from '../../services/transaccion.service';
import { TransaccionData } from '../../models/transaccionData';
import { TiposVehiculo } from '../../models/tiposVehiculo';
import { TiposVehiculoService } from '../../services/tipos-vehiculo.service';
import moment from 'moment';

@Component({
  selector: 'app-registro-servicio',
  templateUrl: './registro-servicio.component.html',
  styleUrl: './registro-servicio.component.css',
  providers: [MessageService],
})
export class RegistroServicioComponent implements OnInit {

  activeIndex = 0;
  vehicleForm: FormGroup;
  clientForm: FormGroup;
  servicioForm: FormGroup;

  personalInfoForm: FormGroup;
  contactDetailsForm: FormGroup;
  items: MenuItem[];
  clientes: ClienteTipo[] = [];
  operadores: Operador[] = [];
  operadoresLibres: Operador[] = [];
  servicios: Servicio[] = [];
  gruas: Grua[] = [];
  gruasLibres: Grua[] = [];
  cliente: Cliente | null = null;
  vehiculo: Vehiculo | null = null;
  servicio: Servicio | null = null;
  clienteBuscado: ClienteTipo | null = null;
  operadorSeleccionado: Operador | null = null;
  gruaSeleccionada: Grua | null = null;

  clientDropdown: any[] = []; // Declaración de la variable estatusDropdown
  operadorDropdown: any[] = []; // Declaración de la variable estatusDropdown
  gruaDropdown: any[] = []; // Declaración de la variable estatusDropdown

  //vehiculo
  selectedMarca: any;
  modelosFiltrados: any[] = [];
  selectedModelo: any;
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  tiposVehiculo: TiposVehiculo[] = [];
  selectedClient: any[] = [];

  listaVacia: string | undefined;
  //
  idCliente: Cliente;
  idVehiculo: Vehiculo;
  vehiculoC: Vehiculo; // Declaración de la variable vehiculo
  idUser: number;
  idServicio: number;
  enaService:boolean= true;
  //subscription: Subscription

  constructor(
    public messageService: MessageService,
    private fb: FormBuilder,
    private clienteTipoService: ClienteTipoService,
    private operadorService: OperadorService,
    private gruaService: GruaService,
    private cienteService: ClienteService,
    private vehiculoService: VehiculoService,
    private tokenService: TokenService,
    private servicioService: ServicioService,
    private router: Router,
    private eventService: EventService,
    private estatusOperador: EstatusOperadorService,
    private estatusGruaService: EstatusGruaService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private transaccionService: TransaccionService,
    private tiposVService: TiposVehiculoService


  ) {
    this.clientForm = this.fb.group({
      numTelefono: ['', Validators.required],
      clienteTipo: ['', Validators.required],
    });

    this.vehicleForm = this.fb.group({
      tipoVehiculo: ['', Validators.required],
      marca: [''],
      modelo: [''],
      placas: [''],
      serie: [''],
      poliza: [''],
      color: [''],
      ano: [''],
    });

    this.servicioForm = this.fb.group({
      ubicacionSalida: ['', Validators.required],
      ubicacionContacto: ['', Validators.required],
      montoCobrado: ['', Validators.required],
      observaciones: [''],
      ubicacionTermino: [''],
      operador: ['', Validators.required],
      grua: ['', Validators.required],
    });


  }

  ngOnInit() {
    this.items = [
      {
        label: 'Datos del cliente',
      },
      {
        label: 'Datos del vehiculo',
      },
      {
        label: 'Datos del servicio',
      },
      {
        label: 'Confirmacion',
      },
    ];

    this.cargarClientes();
    this.cargarOperadores();
    this.cargarGruas();
    this.idUser = this.tokenService.getIdUsuario();
    this.cargarMarcas();
    this.cargarModelos();
    this. cargarTiposVehiculo();

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

  cargarTiposVehiculo(){
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




  onClientInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.clientForm.valid) {
      // Obtener el objeto ClienteTipo seleccionado del formulario
      this.cliente = this.clientForm.value;
      console.log('datos  cliente' + this.cliente.clienteTipo.id);
      //onst clienteTipoSeleccionado: ClienteTipo = this.clientForm.get('clienteTipo').value;
      //console.log(clienteTipoSeleccionado);

      //buscamos el tipo cliente para el nombre
      this.clienteTipoService.detail(this.cliente.clienteTipo.id).subscribe(
        (cliente: ClienteTipo) => {
          this.clienteBuscado = cliente;
          console.log('Cliente buscado:', this.clienteBuscado);
        },
        (error) => {
          console.error('Error al buscar cliente por ID:', error);
        }
      );
      this.activeIndex++; // Avanzar al siguiente paso
    }
  }

  onVehicleInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.vehicleForm.valid) {
      this.vehiculo = this.vehicleForm.value;
      //console.log('modelo' + this.vehicleForm.value.modelo.id);
     // console.log('marca' + this.vehicleForm.value.marca.id);

      this.activeIndex++; // Avanzar al siguiente paso
    }
  }

  onServiceInfoSubmit() {
    this.enaService = false;
    // Procesar los datos del primer formulario si es válido
    if (this.servicioForm.valid) {
      this.servicio = this.servicioForm.value;
      console.log('ser sub'+this.servicioForm.value.operador);
      console.log(this.servicio.grua);

      this.operadorService.detail(this.servicioForm.value.operador).subscribe(
        (operador: Operador) => {
          this.operadorSeleccionado = operador;
          console.log('Operador:', this.operadorSeleccionado.nombre);
        },
        (error) => {
          console.error('Error al buscar operador por ID:', error);
        }
      );

      this.gruaService.detail(this.servicioForm.value.grua).subscribe(
        (grua: Grua) => {
          this.gruaSeleccionada = grua;
          console.log('Grua:', this.gruaSeleccionada.noEco);
        },
        (error) => {
          console.error('Error al buscar grua por ID:', error);
        }
      );


      this.activeIndex++; // Avanzar al siguiente paso
    } else {
      console.log('fomulario servcio invalido');
    }
  }

  onPersonalInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.personalInfoForm.valid) {
      this.activeIndex++; // Avanzar al siguiente paso
    }
  }

  onContactDetailsSubmit() {
    // Procesar los datos del segundo formulario si es válido
    if (this.contactDetailsForm.valid) {
      this.activeIndex++; // Avanzar al siguiente paso
    }
  }

  onBackButtonClick() {
    this.activeIndex--;
  }

  cargarClientes(): void {
    this.clienteTipoService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.clientes = data;

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);

        this.clientDropdown = this.formatoDropdown(this.clientes); // Convertir el formato

        console.log(data);
        console.log('carga estatus' + this.clientes.length);
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

  cargarOperadores(): void {
    this.operadorService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.operadores = data;

        // Filtrar los operadores que no están eliminados
        this.operadores = this.operadores.filter(operador => operador.eliminado === 0);

        // Lista para almacenar operadores libres

        // Obtener el estado de cada operador y filtrar los libres
        this.operadores.forEach(operador => {
          this.estatusOperador.obtenerEstatusOperador(operador.id).subscribe(
            (nombreEstatus) => {
              if (nombreEstatus.nombreEstatus === 'Libre') {
                this.operadoresLibres.push(operador);
                console.log(this.operadoresLibres.length);
              }
              //ponemos en el dropdown los operadores que estan libre solamente, antes filtramos los eliminados
              this.operadorDropdown = this.formatoDropdownOp(this.operadoresLibres); // Convertir el formato

            },
            (error) => {
              console.error('Error al obtener estado del operador:', error);
            }
          );
        });
        console.log(this.operadoresLibres.length);
        // Asignar la lista de operadores libres al arreglo de operadores
        this.operadores = this.operadoresLibres;

        console.log('Carga de operadores completada');
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


  //obtenemos el estado del operador por separado
  getEstadoOperador(id: number): void {


  }

  cargarGruas(): void {
    this.gruaService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.gruas = data;

        this.gruas = this.gruas.filter(grua => grua.eliminado === 0);
        console.log('gruas no borradas' + this.gruas.length);
        this.gruas.forEach(grua => {
          this.estatusGruaService.obtenerEstatusGrua(grua.noEco).subscribe(
            (nombreEstatus) => {
              if (nombreEstatus.nombreEstatus === 'Libre') {
                this.gruasLibres.push(grua);
                console.log('gruas libres' + this.gruasLibres.length);
              }
              //ponemos en el dropdown los operadores que estan libre solamente, antes filtramos los eliminados
              this.gruaDropdown = this.formatoDropdownGr(this.gruasLibres); // Convertir el formato

            },
            (error) => {
              console.error('Error al obtener estado del operador:', error);
            }
          );
        });


        console.log(data);
        console.log('carga estatus' + this.clientes.length);
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


  onConfirm() {
    this.enaService = true; //desabilitamos el boton 
    console.log('Confirmado');
    //OBTENEMOS LA LISTA PARA EL FOLIO
    this.servicioService.lista().subscribe(
      (data) => {
        this.servicios = data;
        console.log('numero de servicios' + this.servicios.length);
        const folio = this.servicios.length + 1; // Calculas correctamente el folio

        //CREAMOS LOS OBJETOS PARA LOS REGISTROS
        const formDataCliente = this.clientForm.value;
        const cliente = new Cliente(formDataCliente.numTelefono, formDataCliente.clienteTipo, 0);

        const formDataVehiculo = this.vehicleForm.value;
        // Convertir campos de vehiculo a mayúsculas
        for (const key of Object.keys(formDataVehiculo)) {
          const value = formDataVehiculo[key];
          if (typeof value === 'string') {
            formDataVehiculo[key] = value.toUpperCase();
          }
        }
        console.log('pv'+this.vehicleForm.value);
        const vehiculo = new Vehiculo(formDataVehiculo.tipoVehiculo, formDataVehiculo.marca?.id, formDataVehiculo.modelo?.id, formDataVehiculo.placas, formDataVehiculo.serie,formDataVehiculo.poliza, formDataVehiculo.color, formDataVehiculo.ano, 1, 0);

        const formDataServicio = this.servicioForm.value;
        // Convertir campos de servicio a mayúsculas
        for (const key of Object.keys(formDataServicio)) {
          const value = formDataServicio[key];
          if (typeof value === 'string') {
            formDataServicio[key] = value.toUpperCase();
          }
        }

        const fechaActual = new Date()
       // console.log('Fecha actual en UTC:', fechaActual.toISOString());        //const fechaActual = moment.utc().toDate();
        //const fechaActual = moment().utc().format();
        console.log('fecha'+fechaActual);

        console.log('veri date'+new Date().getTimezoneOffset()); // Debería ser el mismo en ambos lugares

        console.log(fechaActual);
        const servicio = new Servicio('0000', fechaActual, formDataServicio.ubicacionSalida, formDataServicio.ubicacionContacto, formDataServicio.montoCobrado, formDataServicio.observaciones, formDataServicio.ubicacionTermino, 'EN CURSO', cliente, vehiculo, formDataServicio.operador, formDataServicio.grua, this.idUser, 0);
        servicio.folioServicio = 'OS00' + folio; // Asignas el folio al objeto servicio

        this.crearServicio(cliente, vehiculo, servicio, formDataServicio);
      },
      (err) => {
        console.error('Primer folio:', err);

        //CREAMOS LOS OBJETOS PARA LOS REGISTROS
        const formDataCliente = this.clientForm.value;
        const cliente = new Cliente(formDataCliente.numTelefono, formDataCliente.clienteTipo, 0);

        const formDataVehiculo = this.vehicleForm.value;
        const vehiculo = new Vehiculo(formDataVehiculo.tipoVehiculo, formDataVehiculo.marca.id, formDataVehiculo.modelo.id, formDataVehiculo.placas, formDataVehiculo.serie,formDataVehiculo.poliza, formDataVehiculo.color, formDataVehiculo.ano, 1, 0);

        const formDataServicio = this.servicioForm.value;
        const fechaActual = new Date(); // Formato ISO 8601
        const servicio = new Servicio('0000', fechaActual, formDataServicio.ubicacionSalida, formDataServicio.ubicacionContacto, formDataServicio.montoCobrado, formDataServicio.observaciones, formDataServicio.ubicacionTermino, 'EN CURSO', cliente, vehiculo, formDataServicio.operador, formDataServicio.grua, this.idUser, 0);
        servicio.folioServicio = 'OS00' + 1; // primer folio si no hyay nada

        this.crearServicio(cliente, vehiculo, servicio, formDataServicio);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar servicios para folio' });
      }
    );

  }



  //RECIBE LOS OBJETOS PARA LA TRANSACCION Y LOS FORMDATA DEL SERVICIO PARA OPERADOR Y GRUA
  crearServicio(cliente: Cliente, vehiculo: Vehiculo, servicio: Servicio, formDataServicio: any) {
    const transaccionData = new TransaccionData();
    transaccionData.clienteDto = cliente;
    transaccionData.vehiculoDto = vehiculo;
    transaccionData.servicioDto = servicio;

    this.transaccionService.crearRegistroTransaccional(transaccionData).subscribe(
      (response) => {
        console.log('Transacción exitosa:', response);
        //CAMBIAMOS EL ESTATUS DEL OPERADOR Y DE LA GRUA
        this.cambiarEstatusOperador(formDataServicio.operador);
        this.cambiarEstatusGrua(formDataServicio.grua);
        // Realizar acciones adicionales después de la transacción, como redireccionar o mostrar un mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio registrado exitosamente' });
        this.eventService.emitServicioCreado();

        setTimeout(() => {
          this.mostrarServicios(); // Redirigir después de un breve retraso
        }, 1000); // 1000 milisegundos = 1 segundo (ajusta según sea necesario)
      },
      (error) => {
        console.error('Error en la transacción:', error);
        // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
      }
    );

  }

  cambiarEstatusOperador(idOperador: number) {
    this.estatusOperador.asignarEstatusOperador(idOperador, 'Ocupado').subscribe(
      () => {
        console.log('Estado asignado correctamente al operador');
      },
      (error) => {
        console.error('Error al asignar estado al operador:', error);
      }
    );
  }

  cambiarEstatusGrua(idGrua: number) {
    this.estatusGruaService.asignarEstatusGrua(idGrua, 'Ocupada').subscribe(
      () => {
        console.log('Estado asignado correctamente a la grua');
      },
      (error) => {
        console.error('Error al asignar estado a la grua:', error);
      }
    );
  }


  generarFolio(): number {
    this.servicioService.lista().subscribe(
      (data) => {
        this.servicios = data;
        console.log('gf' + this.servicios.length)
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar servicios para folio';
        }
      }
    );
    return this.servicios.length;
  }

  mostrarServicios() {

    this.router.navigate(['/principal/servicios']);

  }

  //formato de los estatus para usarlo en el droptown
  formatoDropdown(nameClient: ClienteTipo[]): any[] {
    return nameClient.map((item) => ({
      label: item.nombreCliente,
      value: item.id,
    }));
  }

  //formato de los operador para usarlo en el droptown
  formatoDropdownOp(nameOpe: Operador[]): any[] {
    return nameOpe.map((item) => ({ label: item.nombre, value: item.id }));
  }

  //formato de los grua para usarlo en el droptown
  //agregar id a la tabla gruas
  formatoDropdownGr(noEco: Grua[]): any[] {
    return noEco.map((item) => ({ label: item.noEco, value: item.noEco }));
  }
}
