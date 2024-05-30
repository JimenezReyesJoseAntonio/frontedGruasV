import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  servicios: Servicio[] = [];
  listaVacia: string | undefined;
  serviciosRecientes: Servicio[] = [];

  nombreUsuario: string;
  idUser: number;

  constructor( 
    private tokenService: TokenService,
    private serviceService: ServicioService,

  ){  }

 
  ngOnInit(): void {
    this.nombreUsuario = this.tokenService.getNombreUsuario();
    this.idUser = this.tokenService.getIdUsuario();
    this.cargarServicios();
  }

  cargarServicios(): void {

    this.serviceService.lista().subscribe(
      (data) => {
        // Limpiar el arreglo de operadores antes de cargar los nuevos datos
        this.servicios = data;
        this.serviciosRecientes = data;
        console.log('carga servicios' + this.servicios.length);
        //filtramos los servicios que no estan finaliazados para que aparezcan en la tabla
        this.servicios = this.servicios.filter(serv => serv.estadoServicio == 'FINALIZADO');
        this.serviciosRecientes =  this.serviciosRecientes.filter(serv => serv.estadoServicio !== 'FINALIZADO');
        console.log('carga ser' + this.servicios.length);

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

}
