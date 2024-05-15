import { Component, OnInit } from '@angular/core';
import { MenuItem } from './MenuItem';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstatusOperadorService } from '../../services/estatus-operador.service';
import { EstatusGruaService } from '../../services/estatus-grua.service';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { OperadorService } from '../../services/operador.service';
import { GruaService } from '../../services/grua.service';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Marca } from '../../models/marca';
import { Modelo } from '../../models/modelo';
import { ClienteTipo } from '../../models/clienteTipo';
import { Operador } from '../../models/operador';
import { Grua } from '../../models/grua';
import { ClienteTipoService } from '../../services/clienteTipo.service';
import { TokenService } from '../../services/token.service';
import { Vehiculo } from '../../models/vehiculo';
import { MessageService } from 'primeng/api';
import { VehiculoService } from '../../services/vehiculo.service';
import { TiposVehiculoService } from '../../services/tipos-vehiculo.service';
import { TiposVehiculo } from '../../models/tiposVehiculo';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
  providers: [MessageService]

})
export class ServiciosComponent implements OnInit {
  items: MenuItem[] | undefined;
  servicios: Servicio[] = [];
  listaVacia: string | undefined;
  servicio: Servicio | null = null;
  servEdit: Servicio | null = null;
  editingServicio: Servicio | null = null;
  updateDialog: boolean = false;
  deleteServicioDialog: boolean = false;
  servicioFinalizado: Servicio | null = null;
  //formularios
  vehicleForm: FormGroup;
  clientForm: FormGroup;
  servicioForm: FormGroup;

  //vehiculo
  selectedMarca: any;
  modelosFiltrados: any[] = [];
  selectedModelo: any;
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  clientes: ClienteTipo[] = [];
  operadores: Operador[] = [];
  operadoresLibres: Operador[] = [];
  gruas: Grua[] = [];
  gruasLibres: Grua[] = [];
  idUser: number;
  tiposVehiculo: TiposVehiculo[] = [];

  //buttons
  enaClien: boolean = true;
  enaVehi: boolean = true;
  enaSer: boolean = true;


  private eventoServicioCreadoSubscription: Subscription | undefined;

  constructor(
    public router: Router,
    private serviceService: ServicioService,
    private eventService: EventService,
    private fb: FormBuilder,
    private estatusOperador: EstatusOperadorService,
    private estatusGruaService: EstatusGruaService,
    private clienteService: ClienteService,
    private operadorService: OperadorService,
    private gruaService: GruaService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private clienteTipoService: ClienteTipoService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private vehiculoService: VehiculoService,
    private tiposVService: TiposVehiculoService



  ) {
    this.clientForm = this.fb.group({
      numTelefono: ['', Validators.required],
      clienteTipo: ['', Validators.required],
    });

    this.vehicleForm = this.fb.group({
      tipoVehiculo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placas: ['', Validators.required],
      serie: ['', Validators.required],
      color: ['', Validators.required],
      ano: ['', Validators.required],
    });

    this.servicioForm = this.fb.group({
      ubicacionSalida: ['', Validators.required],
      ubicacionContacto: ['', Validators.required],
      montoCobrado: ['', Validators.required],
      observaciones: ['', Validators.required],
      ubicacionTermino: ['', Validators.required],
      operador: ['', Validators.required],
      grua: ['', Validators.required],
    });


  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Servicio',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Nuevo',
            icon: 'pi pi-fw pi-plus',
            command: () => {
              this.navigateToNuevo(); // Llama a un método para navegar a la ruta
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      },
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus',
            command: () => {
              this.navigateToClient(); // Llama a un método para navegar a la ruta
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
      }
    ];

    this.cargarServicios();
    this.eventoServicioCreadoSubscription = this.eventService.servicioCreado$.subscribe(() => {
      this.cargarServicios(); // Actualizar la lista de servicios
    });

    this.cargarClientes();
    this.cargarOperadores();
    this.cargarGruas();
    this.idUser = this.tokenService.getIdUsuario();
    this.cargarMarcas();
    this.cargarModelos();
    this.cargarTiposVehiculo();
  }

  ngOnDestroy(): void {
    if (this.eventoServicioCreadoSubscription) {
      this.eventoServicioCreadoSubscription.unsubscribe();
    }
  }
  cargarServicios(): void {

    this.serviceService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.servicios = data.reverse();//regresa la lista de servicios en orden inverso
        console.log('carga servicios' + this.servicios.length);
        //filtramos los servicios que no estan finaliazados para que aparezcan en la tabla
        this.servicios = this.servicios.filter(serv => serv.estadoServicio !== 'FINALIZADO');

        //filtramos solo las gruas que no han sido borrados
        //this.operadores = this.operadores.filter(operador => operador.eliminado === 0); 
        this.listaVacia = undefined;
      },
      (err) => {
        if (err && err.error && err.error.message) {
          this.listaVacia = err.error.message;
        } else {
          this.listaVacia = 'Error al cargar servicios';
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


  cargarClientes(): void {
    this.clienteTipoService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.clientes = data;

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);

        //this.clientDropdown = this.formatoDropdown(this.clientes); // Convertir el formato

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
              //  this.operadorDropdown = this.formatoDropdownOp(this.operadoresLibres); // Convertir el formato

            },
            (error) => {
              console.error('Error al obtener estado del operador:', error);
            }
          );
        });
        console.log(this.operadoresLibres.length);
        // Asignar la lista de operadores libres al arreglo de operadores
       // this.operadores = this.operadoresLibres;

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
              //this.gruaDropdown = this.formatoDropdownGr(this.gruasLibres); // Convertir el formato

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

  navigateToNuevo() {
    this.router.navigate(['/principal/servicios/nuevo']); // Navega a la ruta '/principal/dashboard'
    console.log('holaaa');
  }

  navigateToClient() {
    this.router.navigate(['/principal/servicios/cliente']); // Navega a la ruta '/principal/dashboard'


  }

  editServicio(servicio: Servicio) {
    this.enaClien = false;
    this.enaVehi = false;
    this.enaSer = false;
    this.editingServicio = { ...servicio }; // Clonar el operador para evitar modificar el original directamente
    console.log('ll' + servicio.cliente.id);

    this.serviceService.detail(servicio.id).subscribe(
      (data) => {
        this.servEdit = data;
        this.selectedMarca =this.servEdit.vehiculo.marca; // para que tenga como primer valor la marca original del servicio
        this.selectedModelo= this.servEdit.vehiculo.modelo;// "" modelo original del servicio
        this.filtrarModelosPorMarca(); // filtra los valores de la marca del servicio para no mostrar todos

        console.log(this.servEdit.cliente.clienteTipo);
        console.log(this.servEdit.vehiculo.tipoVehiculo);

      },
      (err) => {
        console.log(err);

      }
    );
    console.log('nada' + servicio.id);
    this.updateDialog = true; // Mostrar el diálogo de edición

  }



  confirmFinishServicio(servicio: Servicio) {
    this.deleteServicioDialog = true; // Mostrar el diálogo de edición
    this.servicioFinalizado = { ...servicio }; // Clonar el servicio para evitar modificar el original directamente

  }

  finServicio() {
    const servicio = this.servicioFinalizado;
    const folio = servicio.id;
    console.log(folio);

    //cambia el estatus del servicio a finalizado para liberar a los operadores y grua
    this.serviceService.detail(folio).subscribe(
      (data) => {

        const idOpe = data.operador.id;
        const idGrua = data.grua.noEco;
        const idSer = data.id;
        console.log(idOpe);
        console.log(idGrua);
        this.cambiarEstatusOperador(idOpe);
        this.cambiarEstatusGrua(idGrua);
        this.cambiarEstatusServicio(idSer, 'estadoServicio', 'FINALIZADO');

        //servicio.estadoServicio = 'Completado';
        console.log('llega aqui' + servicio);

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

  cambiarEstatusOperador(idOperador: number) {
    this.estatusOperador.asignarEstatusOperador(idOperador, 'Libre').subscribe(
      () => {
        console.log('Estado asignado correctamente al operador');
      },
      (error) => {
        console.error('Error al asignar estado al operador:', error);
      }
    );
  }

  cambiarEstatusGrua(idGrua: number) {
    this.estatusGruaService.asignarEstatusGrua(idGrua, 'Libre').subscribe(
      () => {
        console.log('Estado asignado correctamente a la grua');
      },
      (error) => {
        console.error('Error al asignar estado a la grua:', error);
      }
    );
  }

  cambiarEstatusServicio(id: number, campo: string, nuevoValor: any) {
    this.serviceService.upadateEstatus(id, campo, nuevoValor).subscribe(
      () => {
        console.log('Estado asignado correctamente al servicio');
        //al finalizar un servicio cargamos nuevamente los servicios
        this.cargarServicios();
        this.deleteServicioDialog = false; // Mostrar el diálogo de edición

      },
      (error) => {
        console.error('Error al asignar estado al servicio:', error);
      }
    );

  }

  updateServicio() {

    console.log(this.clientForm.value);
    console.log(this.vehicleForm.value);
    console.log(this.servicioForm.value);

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
    const vehiculo = new Vehiculo(formDataVehiculo.tipoVehiculo, formDataVehiculo.marca.id, formDataVehiculo.modelo.id, formDataVehiculo.placas, formDataVehiculo.serie, formDataVehiculo.color, formDataVehiculo.ano, 1, 0);

    const formDataServicio = this.servicioForm.value;
    // Convertir campos de servicio a mayúsculas
    for (const key of Object.keys(formDataServicio)) {
      const value = formDataServicio[key];
      if (typeof value === 'string') {
        formDataServicio[key] = value.toUpperCase();
      }
    }

    const servicio = new Servicio(this.editingServicio.folioServicio, this.editingServicio.fecha, formDataServicio.ubicacionSalida, formDataServicio.ubicacionContacto, formDataServicio.montoCobrado, formDataServicio.observaciones, formDataServicio.ubicacionTermino, 'EN CURSO', cliente, vehiculo, formDataServicio.operador, formDataServicio.grua, this.idUser, 0);

    //this.crearServicio(cliente, vehiculo, servicio, formDataServicio);

  }

  updateCliente() {
    console.log('up cli' + this.servEdit.cliente.id);
    const idClien = this.servEdit.cliente.id;
    const formDataCliente = this.clientForm.value;
    const cliente = new Cliente(formDataCliente.numTelefono, formDataCliente.clienteTipo, 0);

    this.clienteService.update(idClien, cliente).subscribe(
      () => {
        this.enaClien = true;

        console.log('exito actualizado cliente');
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado exitosamente' });

      },
      (err) => {
        console.error('Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
      }
    );

  }

  updateVehiculo() {
    const idVehi = this.servEdit.vehiculo.id;

    const formDataVehiculo = this.vehicleForm.value;
    // Convertir campos de vehiculo a mayúsculas
    for (const key of Object.keys(formDataVehiculo)) {
      const value = formDataVehiculo[key];
      if (typeof value === 'string') {
        formDataVehiculo[key] = value.toUpperCase();
      }
    }
    const vehiculo = new Vehiculo(formDataVehiculo.tipoVehiculo, formDataVehiculo.marca.id, formDataVehiculo.modelo.id, formDataVehiculo.placas, formDataVehiculo.serie, formDataVehiculo.color, formDataVehiculo.ano, 1, 0);

    this.vehiculoService.update(idVehi, vehiculo).subscribe(
      () => {
        this.enaVehi = true;
        console.log('exito actualizado vehiculo');
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehiculo actualizado exitosamente' });

      },
      (err) => {
        console.error('Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
      }
    );

  }

  updateService() {
    console.log('up serv' + this.servEdit.id);
    const idSer = this.servEdit.id;
    const formDataServicio = this.servicioForm.value;
    // Convertir campos de servicio a mayúsculas
    for (const key of Object.keys(formDataServicio)) {
      const value = formDataServicio[key];
      if (typeof value === 'string') {
        formDataServicio[key] = value.toUpperCase();
      }
    }

    const servicio = new Servicio(this.editingServicio.folioServicio, this.editingServicio.fecha, formDataServicio.ubicacionSalida, formDataServicio.ubicacionContacto, formDataServicio.montoCobrado, formDataServicio.observaciones, formDataServicio.ubicacionTermino, 'EN CURSO', this.servEdit.cliente, this.servEdit.vehiculo, formDataServicio.operador, formDataServicio.grua, this.idUser, 0);

    this.serviceService.update(idSer, servicio).subscribe(
      () => {
        this.enaSer = true;
        console.log('exito actualizado vehiculo');
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio actualizado exitosamente' });
        this.cargarServicios();
      },
      (err) => {
        console.error('Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
      }
    );
  }

  // cambia el color del tag
  getSeverity(status: string) {
    switch (status) {
      case 'EN CURSO':
        return 'success';
      case 'FINALIZADO':
        return 'warning';
      case 'Fuera de servicio':
        return 'danger';
      default:
        return ''; // Handle other cases, such as returning an empty string
    }
  }


}
