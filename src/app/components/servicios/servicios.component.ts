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

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit  {
  items: MenuItem[] | undefined;
  servicios: Servicio[] = [];
  listaVacia: string | undefined;
  servicio: Servicio | null = null;
  servicioFom: FormGroup;
  updateDialog: boolean = false;
  deleteServicioDialog:boolean =false;
  servicioFinalizado:Servicio | null = null;

  private eventoServicioCreadoSubscription: Subscription | undefined;

  constructor(
    public router: Router,
    private serviceService:ServicioService,
    private eventService: EventService,
    private fb: FormBuilder,
    private estatusOperador: EstatusOperadorService,
    private estatusGruaService: EstatusGruaService


  ){
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
         this.servicios = this.servicios.filter(serv => serv.estadoServicio !== 'Finalizado'); 

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


navigateToNuevo() {
  this.router.navigate(['/principal/servicios/nuevo']); // Navega a la ruta '/principal/dashboard'
  console.log('holaaa');
}

navigateToClient(){
    this.router.navigate(['/principal/servicios/cliente']); // Navega a la ruta '/principal/dashboard'


}

editOperador() {
    console.log('nada');
    this.updateDialog = true; // Mostrar el diálogo de edición

  }

  confirmFinishServicio(servicio:Servicio){
    this.deleteServicioDialog = true; // Mostrar el diálogo de edición
    this.servicioFinalizado = { ...servicio }; // Clonar el servicio para evitar modificar el original directamente

  }

  finServicio(){
    const servicio = this.servicioFinalizado;
    const folio= servicio.id;
    console.log(folio);


    this.serviceService.detail(folio).subscribe(
      (data) => {

        const idOpe = data.operador.id;
        const idGrua = data.grua.noEco;
        const idSer = data.id;
        console.log(idOpe);
        console.log(idGrua);
        this.cambiarEstatusOperador(idOpe);
        this.cambiarEstatusGrua(idGrua);
        this.cambiarEstatusServicio(idSer,'estadoServicio','Finalizado');
        
        //servicio.estadoServicio = 'Completado';
        console.log('llega aqui'+servicio);
        
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

  cambiarEstatusOperador(idOperador:number){
    this.estatusOperador.asignarEstatusOperador(idOperador, 'Libre').subscribe(
      () => {
        console.log('Estado asignado correctamente al operador');
      },
      (error) => {
        console.error('Error al asignar estado al operador:', error);
      }
    );
  }

  cambiarEstatusGrua(idGrua:number){
    this.estatusGruaService.asignarEstatusGrua(idGrua, 'Libre').subscribe(
      () => {
        console.log('Estado asignado correctamente a la grua');
      },
      (error) => {
        console.error('Error al asignar estado a la grua:', error);
      }
    );
  }

  cambiarEstatusServicio(id: number, campo: string, nuevoValor: any){
    this.serviceService.upadateEstatus(id,campo,nuevoValor).subscribe(
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
}
