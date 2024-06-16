import { Component, OnInit } from '@angular/core';
import { MenuItem } from './MenuItem';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio';
import { Observable, Subscription, forkJoin, map, of, tap } from 'rxjs';
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
import { WhatsappApiCloudService } from '../../services/whatsapp-api-cloud.service';
import { MessageOperador } from '../../Whatsapp/interfaces/message-operador';
import { COMPONENT_TYPE, MESSAGING_PRODUCT, PARAMETER_TYPE, TEMPLATE_LANGUAGE, TEMPLATE_NAME, TEMPLATE_TYPE } from '../../common/api-resource';
import { PdfService } from '../../services/pdf.service';
import { HttpResponse } from '@angular/common/http';

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
  selectedOperador: any;
  selectedGrua: any;
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
  estatusOpe: string;
  estatusGrua: string;


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
    private tiposVService: TiposVehiculoService,
    private whatsappService: WhatsappApiCloudService,
    private pdfservice: PdfService



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
      poliza: ['', Validators.required],
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
            label: 'Buscar',
            icon: 'pi pi-fw pi-search'
          },
          {
            separator: true
          },
          {
            label: 'Exportar',
            icon: 'pi pi-fw pi-external-link',
            command: () => {
              this.navigateToExport();
              // Llama a un método para navegar a la ruta
            }
          }
        ]
      },
      {
        label: 'Cotizaciones',
        icon: 'pi pi-fw pi-book',
        items: [
          {
            label: 'Nueva',
            icon: 'pi pi-fw pi-plus'
          },
        ]
      },
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-user',
        command: () => {
          this.navigateToClient(); // Llama a un método para navegar a la ruta
        }
      },
      {
        label: 'Vehiculos',
        icon: 'pi pi-fw pi-car',
         command: () => {
              this.navigateToVehicle(); // Llama a un método para navegar a la ruta
            }
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
    //this.editingServicio
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
                console.log('opeLibres' + this.operadoresLibres.length);
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

  navigateToVehicle() {
    this.router.navigate(['/principal/servicios/vehiculo']); // Navega a la ruta '/principal/dashboard'

  }

  navigateToExport() {
    this.router.navigate(['/principal/servicios/exportar-servicios']); // Navega a la ruta '/principal/dashboard'
  }

  editServicio(servicio: Servicio) {
    this.enaClien = false;
    this.enaVehi = false;
    this.enaSer = false;
    this.editingServicio = { ...servicio }; // Clonar el operador para evitar modificar el original directamentec
    console.log('editado' + this.editingServicio.operador.nombre);
    console.log('ll' + servicio.cliente.id);

    this.serviceService.detail(servicio.id).subscribe(
      (data) => {
        this.servEdit = data;
        this.selectedMarca = this.servEdit.vehiculo.marca; // para que tenga como primer valor la marca original del servicio
        this.selectedOperador = this.servEdit.operador;
        this.selectedGrua = this.servEdit.grua;
        this.selectedModelo = this.servEdit.vehiculo.modelo;// "" modelo original del servicio
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
        this.cambiarEstatusOperador(idOpe, 'Libre');
        this.cambiarEstatusGrua(idGrua, 'Libre');
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

  cambiarEstatusOperador(idOperador: number, valor: string) {
    this.estatusOperador.asignarEstatusOperador(idOperador, valor).subscribe(
      () => {
        console.log('Estado asignado correctamente al operador');
      },
      (error) => {
        console.error('Error al asignar estado al operador:', error);
      }
    );
  }

  cambiarEstatusGrua(idGrua: number, valor: string) {
    this.estatusGruaService.asignarEstatusGrua(idGrua, valor).subscribe(
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
    const vehiculo = new Vehiculo(formDataVehiculo.tipoVehiculo, formDataVehiculo.marca.id, formDataVehiculo.modelo.id, formDataVehiculo.placas, formDataVehiculo.serie, formDataVehiculo.poliza, formDataVehiculo.color, formDataVehiculo.ano, 1, 0);

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
    const idSer = this.servEdit.id;
    const formDataServicio = this.servicioForm.value;

    // Convertir campos de servicio a mayúsculas
    this.convertirCamposMayusculas(formDataServicio);

    const idOperador = this.servEdit.operador.id;//usamos servEdit no editingServicio ya que cambia por el ngmodel
    console.log('id operador servicio' + idOperador);

    const idGrua = this.servEdit.grua.noEco;

    const idOpeCambiado = formDataServicio.operador.id;
    console.log('id operador servicio cambiado' + idOpeCambiado);


    const idGruaCambiada = formDataServicio.grua.noEco;

    forkJoin([
      this.obtenerEstatusOperador(idOperador, idOpeCambiado),
      this.obtenerEstatusGrua(idGrua, idGruaCambiada)
    ]).subscribe(([estatusOperador, estatusGrua]) => {
      if (estatusOperador && estatusGrua) {
        // Actualizar el estatus del operador si corresponde
        if (idOperador != idOpeCambiado) {
          console.log('operadores cambiado de ' + idOpeCambiado + ' a ' + idOpeCambiado);
          this.cambiarEstatusOperador(idOperador, 'Libre'); // Cambiar el estatus del operador anterior a 'Libre'
          this.cambiarEstatusOperador(idOpeCambiado, 'Ocupado'); // Cambiar el estatus del operador cambiado a 'Ocupado'
        }

        // Actualizar el estatus de la grúa si corresponde
        if (idGrua != idGruaCambiada) {
          this.cambiarEstatusGrua(idGrua, 'Libre'); // Cambiar el estatus de la grúa anterior a 'Libre'
          this.cambiarEstatusGrua(idGruaCambiada, 'Ocupada'); // Cambiar el estatus de la grúa cambiada a 'Ocupada'
        }

        // Actualizar el servicio después de haber actualizado los estatus de operador y grúa
        const servicio = this.actualizarServicio(formDataServicio);
        this.serviceService.update(idSer, servicio).subscribe(
          () => {
            this.enaSer = true;
            console.log('exito actualizado servicio');
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio actualizado exitosamente' });
            this.cargarServicios();
          },
          (err) => {
            console.error('Error:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
          }
        );
      }
    });
  }

  convertirCamposMayusculas(formData: any) {
    for (const key of Object.keys(formData)) {
      const value = formData[key];
      if (typeof value === 'string') {
        formData[key] = value.toUpperCase();
      }
    }
  }

  obtenerEstatusOperador(idOperador: number, idOpeCambiado: number): Observable<boolean> {
    console.log('no entra estatus operador');
    console.log('id operador' + idOperador);
    console.log('id operador cambiado' + idOpeCambiado);

    if (idOperador != idOpeCambiado) {
      console.log('operador diferente');

      return this.estatusOperador.obtenerEstatusOperador(idOpeCambiado).pipe(
        tap((response) => {
          if (response.nombreEstatus === 'Ocupado') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El operador se encuentra ocupado' });
          }
        }),
        map((response) => response.nombreEstatus !== 'Ocupado')
      );
    } else {
      return of(true); // No hubo cambios en el operador
    }
  }

  obtenerEstatusGrua(idGrua: number, idGruaCambiada: number): Observable<boolean> {
    console.log('no entra estatus grua');

    if (idGrua != idGruaCambiada) {
      console.log('grua diferente');

      return this.estatusGruaService.obtenerEstatusGrua(idGruaCambiada).pipe(
        tap((response) => {
          if (response.nombreEstatus === 'Ocupada') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La grua se encuentra ocupada' });
          }
        }),
        map((response) => response.nombreEstatus !== 'Ocupada')
      );
    } else {
      return of(true); // No hubo cambios en la grúa
    }
  }

  actualizarServicio(formData: any): Servicio {
    return new Servicio(
      this.editingServicio.folioServicio, this.editingServicio.fecha,
      formData.ubicacionSalida, formData.ubicacionContacto, formData.montoCobrado,
      formData.observaciones, formData.ubicacionTermino, 'EN CURSO',
      this.servEdit.cliente, this.servEdit.vehiculo, formData.operador, formData.grua,
      this.idUser, 0
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

  enviarMensaje(servicio: Servicio) {
    const data: MessageOperador = {
      messaging_product: MESSAGING_PRODUCT.whatsapp,
      to: '52' + servicio.operador.numTelefono,
      type: TEMPLATE_TYPE.type,
      template: {
        name: TEMPLATE_NAME.messageOperador,
        language: {
          code: TEMPLATE_LANGUAGE.es
        },
        components: [
          {
            type: COMPONENT_TYPE.header,
            parameters: [
              {
                type: PARAMETER_TYPE.text,
                text: 'GRÚAS VESCO'

              }
            ]

          },
          {
            type: COMPONENT_TYPE.body,
            parameters: [
              {
                type: PARAMETER_TYPE.text,
                text: servicio.operador.nombre

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.ubicacionContacto

              },
              {
                type: PARAMETER_TYPE.text,
                text: 'G0' + servicio.grua.noEco

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.vehiculo.marca.nombre

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.vehiculo.modelo.nombre

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.vehiculo.serie

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.vehiculo.placas

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.vehiculo.color

              },
              {
                type: PARAMETER_TYPE.text,
                text: servicio.cliente.numTelefono

              }
            ]

          }
        ]
      }

    }

    this.whatsappService.sendMessage(data).subscribe(
      resp => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Mensaje enviado exitosamente' });
        console.log('se mando el whatsapp');
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al mandar mensaje' });

        console.log(error);
      }
    )
  }


  generarCartaPorte(servicio: Servicio) {
    console.log(servicio.id);
    this.pdfservice.generatePdf(servicio.id).subscribe(
      (response: HttpResponse<Blob>) => {
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Asignar nombre al archivo basado en los parámetros
        let filename = `servicio_${servicio.folioServicio}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        // Manejo de errores y mostrar mensaje
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el PDF. Por favor, intente nuevamente.',
        });
        console.error('Error al generar el PDF', error);
      }
    );
  }

}
