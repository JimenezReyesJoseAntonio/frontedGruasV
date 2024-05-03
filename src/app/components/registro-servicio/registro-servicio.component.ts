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
  servicioFom: FormGroup;

  personalInfoForm: FormGroup;
  contactDetailsForm: FormGroup;
  items: MenuItem[];
  clientes: ClienteTipo[] = [];
  operadores: Operador[] = [];
  operadoresLibres: Operador[] = [];
  servicios: Servicio[] = [];
  gruas: Grua[] = [];
  cliente: Cliente | null = null;
  vehiculo: Vehiculo | null = null;
  servicio: Servicio | null = null;
  clienteBuscado: ClienteTipo | null = null;
  operadorSeleccionado: Operador | null = null;
  gruaSeleccionada: Grua | null = null;

  clientDropdown: any[] = []; // Declaración de la variable estatusDropdown
  operadorDropdown: any[] = []; // Declaración de la variable estatusDropdown
  gruaDropdown: any[] = []; // Declaración de la variable estatusDropdown

  listaVacia: string | undefined;
  //
  idCliente: number;
  idVehiculo: number;
  vehiculoC: Vehiculo; // Declaración de la variable vehiculo
  idUser: number;
  idServicio: number;
  //subscription: Subscription;

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
    private estatusOperador: EstatusOperadorService

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

    this.servicioFom = this.fb.group({
      ubicacionSalida: ['', Validators.required],
      ubicacionContacto: ['', Validators.required],
      montoCobrado: ['', Validators.required],
      observaciones: ['', Validators.required],
      ubicacionTermino: ['', Validators.required],
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

  }





  onClientInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.clientForm.valid) {
      // Obtener el objeto ClienteTipo seleccionado del formulario
      this.cliente = this.clientForm.value;
      console.log('datos  cliente' + this.cliente.clienteTipo);
      //onst clienteTipoSeleccionado: ClienteTipo = this.clientForm.get('clienteTipo').value;
      //console.log(clienteTipoSeleccionado);

      //buscamos el tipo cliente para el nombre
      this.clienteTipoService.detail(this.cliente.clienteTipo).subscribe(
        (cliente: ClienteTipo) => {
          this.clienteBuscado = cliente;
          console.log('Cliente buscado:', this.clienteBuscado.nombreCliente);
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
      this.activeIndex++; // Avanzar al siguiente paso
    }
  }

  onServiceInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.servicioFom.valid) {
      this.servicio = this.servicioFom.value;

      this.operadorService.detail(this.servicio.operador).subscribe(
        (operador: Operador) => {
          this.operadorSeleccionado = operador;
          console.log('Operador:', this.operadorSeleccionado.nombre);
        },
        (error) => {
          console.error('Error al buscar operador por ID:', error);
        }
      );

      this.gruaService.detail(this.servicio.grua).subscribe(
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
      console.log('kk');
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
        console.log(this.operadoresLibres.length );
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

        this.gruaDropdown = this.formatoDropdownGr(this.gruas); // Convertir el formato

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
    // Procesar la confirmación final, enviar datos, etc.
    console.log('Confirmado');

    //una vez confirmado guradamos los datos en la tabla: cliente, vehiculo
    this.cienteService.save(this.cliente).subscribe(
      (response) => {
        // Operador registrado exitosamente
        console.log('response ' + response);
        this.idCliente = response;
        console.log(this.idCliente);

        // Llamar a una función para crear el vehículo después de guardar el cliente
        this.crearVehiculo();

      },
      error => {
        // Error al registrar el operador
        console.error('Error:', error);
        console.log('entre');

        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    );


  }

  crearVehiculo() {
    console.log('crear vehiculo ' + this.idCliente);
    const formData = this.vehicleForm.value;
    const vehiculo = new Vehiculo(
      formData.tipoVehiculo, formData.marca, formData.modelo, formData.placas, formData.serie, formData.color, formData.ano, this.idCliente, 0
    );
    console.log(vehiculo);

    this.vehiculoService.save(vehiculo).subscribe(
      (response) => {
        // Operador registrado exitosamente
        this.idVehiculo = response;
        this.crearServicio();
      },
      error => {
        // Error al registrar el operador
        console.error('Error:', error);
        console.log('entre');

        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    );

  }

  crearServicio() {
    const formData = this.servicioFom.value;
    const fechaActual = new Date();

    this.servicioService.lista().subscribe(
      (data) => {
        this.servicios = data;
        console.log('numero de servicios'+this.servicios.length);
        const folio = this.servicios.length + 1; // Aquí obtienes el folio correctamente

        const servicio = new Servicio(
          '', fechaActual, formData.ubicacionSalida, formData.ubicacionContacto, formData.montoCobrado, formData.observaciones, formData.ubicacionTermino, "en curso", this.idCliente, this.idVehiculo, formData.operador, formData.grua, this.idUser, 0
        );

        servicio.folioServicio = 'OS00'+folio; // Asignas el folio al objeto servicio

        this.servicioService.save(servicio).subscribe(
          (response) => {

            const idOperador = response.operador;
            this.cambiarEstatusOperador(idOperador);
            console.log('id para cambiar estatus'+ idOperador);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio registrado exitosamente' });
            this.eventService.emitServicioCreado();

            setTimeout(() => {
              this.mostrarServicios(); // Redirigir después de un breve retraso
            }, 3000); // 1000 milisegundos = 1 segundo (ajusta según sea necesario)
          },
          error => {
            console.error('Error al registrar el servicio:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          }
        );
      },
      (err) => {
        console.error('Error al cargar servicios para folio:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar servicios para folio' });
      }
    );
  }

  cambiarEstatusOperador(idOperador:number){
    this.estatusOperador.asignarEstatusOperador(idOperador, 'Ocupado').subscribe(
      () => {
        console.log('Estado asignado correctamente al operador');
      },
      (error) => {
        console.error('Error al asignar estado al operador:', error);
      }
    );
  }


  generarFolio(): number {
    this.servicioService.lista().subscribe(
      (data) => {
        this.servicios = data;
        console.log('gf'+this.servicios.length)
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
