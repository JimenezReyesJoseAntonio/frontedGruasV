import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteTipo } from '../../models/clienteTipo';
import { MessageService } from 'primeng/api';
import { ClienteTipoService } from '../../services/clienteTipo.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
  providers: [MessageService]

})
export class ClienteComponent {
  clientForm: FormGroup;
  cliente: ClienteTipo | null = null;

  constructor(
    private messageService: MessageService,
    private clienteService: ClienteTipoService,
    private fb: FormBuilder,

  ) {
    this.clientForm = this.fb.group({
      nombreCliente: [null, [Validators.required]],

    });
  }


  registrarCliente(): void{
   
    this.cliente = this.clientForm.value;

    if (this.clientForm.valid) {
      console.log(this.clientForm.value);

      const formData = { ...this.clientForm.value }; // Clonar el objeto para no modificar el original

     
      //const formData = this.gruaForm.value;
      this.clienteService.save(formData).subscribe(
        () => {
          // Operador registrado exitosamente
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente registrado exitosamente' });
          this.clientForm.reset();

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
