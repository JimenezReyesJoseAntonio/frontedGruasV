import { Component, OnInit } from '@angular/core';
import { MenuItem } from './MenuItem';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-registro-servicio',
  templateUrl: './registro-servicio.component.html',
  styleUrl: './registro-servicio.component.css',
  providers: [MessageService]
})
export class RegistroServicioComponent implements OnInit {

  activeIndex = 0;
  vehicleForm: FormGroup;
  clientForm: FormGroup;

  personalInfoForm: FormGroup;
  contactDetailsForm: FormGroup;
  items: MenuItem[];
  clientes: Cliente[] = [];
  clientDropdown: any[] = []; // Declaración de la variable estatusDropdown
  listaVacia: string | undefined;

  //subscription: Subscription;

  constructor(
    public messageService: MessageService, 
    private fb: FormBuilder,
    private clienteService: ClienteService,
  ) {

    this.clientForm = this.fb.group({
      numTelefono: ['', Validators.required],
      clienteTipo: ['', Validators.required]
    });

    this.vehicleForm = this.fb.group({
      tipoVehiculo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placas:  ['', Validators.required],
      serie:  ['', Validators.required],
      color: ['', Validators.required],
      ano:  ['', Validators.required],
    });

    this.personalInfoForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]
      });
  

    this.contactDetailsForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.pattern('[0-9]{10}')],
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
        }
    ];
    
    this.cargarClientes();
}

onClientInfoSubmit(){
   // Procesar los datos del primer formulario si es válido
   if (this.clientForm.valid) {
    this.activeIndex++; // Avanzar al siguiente paso
  }

}

onVehicleInfoSubmit(){
  // Procesar los datos del primer formulario si es válido
  if (this.vehicleForm.valid) {
   this.activeIndex++; // Avanzar al siguiente paso
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

  cargarClientes(): void {

    this.clienteService.lista().subscribe(
      data => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.clientes = data;

        //this.clientes = this.clientes.filter(est => est.eliminado === 0);

        this.clientDropdown = this.formatoDropdown(this.clientes); // Convertir el formato

        console.log(data);
        console.log('carga estatus' + this.clientes.length)

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

  onConfirm() {
    // Procesar la confirmación final, enviar datos, etc.
    console.log('Confirmado');
  }

//formato de los estatus para usarlo en el droptown
formatoDropdown(nameClient: Cliente[]): any[] {
  return nameClient.map(item => ({ label: item.nombreCliente, value: item.id }));
}

}
