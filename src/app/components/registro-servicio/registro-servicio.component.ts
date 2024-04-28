import { Component, OnInit } from '@angular/core';
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

  //subscription: Subscription;

  constructor(
    public messageService: MessageService,
    private fb: FormBuilder,
    private clienteTipoService: ClienteTipoService,
    private operadorService: OperadorService,
    private gruaService: GruaService
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
  }

  onClientInfoSubmit() {
    // Procesar los datos del primer formulario si es válido
    if (this.clientForm.valid) {
      // Obtener el objeto ClienteTipo seleccionado del formulario
      this.cliente = this.clientForm.value;
      console.log('numero  cliente' + this.cliente.numTelefono);
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

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);

        this.operadorDropdown = this.formatoDropdownOp(this.operadores); // Convertir el formato

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

  cargarGruas(): void {
    this.gruaService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.gruas = data;

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);

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
