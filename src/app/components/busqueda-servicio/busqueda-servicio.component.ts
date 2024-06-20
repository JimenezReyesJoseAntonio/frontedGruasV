import { Component } from '@angular/core';
import { Servicio } from '../../models/servicio';
import { ServicioService } from '../../services/servicio.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-busqueda-servicio',
  templateUrl: './busqueda-servicio.component.html',
  styleUrl: './busqueda-servicio.component.css',
  providers: [MessageService]

})
export class BusquedaServicioComponent {
  servicios: Servicio[] = [];
  servicio: Servicio | null = null;
  folio: string = ''; // Variable para el input de búsqueda
  verDialog: boolean = false;

  constructor(
     private serviceService: ServicioService,
     private messageService: MessageService,
     ) {
  }

  buscarServicio() {
    this.servicios= [];
    this.servicio =  null;
    if (this.folio.trim()) {
      this.serviceService.detailByFolio(this.folio).subscribe(
        (data) => {
          this.servicio = data;
          this.servicios.push(this.servicio);
          console.log('Servicio encontrado:', this.servicio);
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });

        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo esta vacio'});
    }
  }

  abrirDialog(){
    this.verDialog = true;
  }

  cerrarDialog(){
    this.verDialog = false;
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
