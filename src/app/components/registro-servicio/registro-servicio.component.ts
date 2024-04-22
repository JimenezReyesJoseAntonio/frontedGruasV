import { Component, OnInit } from '@angular/core';
import { MenuItem } from './MenuItem';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-servicio',
  templateUrl: './registro-servicio.component.html',
  styleUrl: './registro-servicio.component.css',
  providers: [MessageService]
})
export class RegistroServicioComponent implements OnInit {

  activeIndex = 0;
  vehicleForm: FormGroup;
  personalInfoForm: FormGroup;
  contactDetailsForm: FormGroup;
  items: MenuItem[];

  //subscription: Subscription;

  constructor(public messageService: MessageService, private fb: FormBuilder  ) {

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
            label: 'Datos del vehiculo',
        },
        {
            label: 'Datos del cliente',
        },
        {
            label: 'Datos del servicio',
        },
        {
            label: 'Confirmacion',
        }
    ];
    
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

  onConfirm() {
    // Procesar la confirmación final, enviar datos, etc.
    console.log('Confirmado');
  }



}
