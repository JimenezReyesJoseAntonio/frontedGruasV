import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio';
import { Operador } from '../../models/operador';
import { Grua } from '../../models/grua';
import { OperadorService } from '../../services/operador.service';
import { GruaService } from '../../services/grua.service';
import { EstatusOperadorService } from '../../services/estatus-operador.service';
import { EstatusGruaService } from '../../services/estatus-grua.service';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  servicios: Servicio[] = [];
  operadores: Operador[] = [];
  operadoresLibres: Operador[] = [];
  operadoresOcupados: Operador[] = [];
  gruas: Grua[] = [];
  gruasLibres: Grua[] = [];
  gruasOcupadas: Grua[] = [];
  listaVacia: string | undefined;
  serviciosRecientes: Servicio[] = [];
  nombreUsuario: string;
  idUser: number;
  gananciasDiarias: number = 0; // Inicializa la variable
  data: any;
  options: any;
  
  constructor(
    private tokenService: TokenService,
    private serviceService: ServicioService,
    private operadorService: OperadorService,
    private gruaService: GruaService,
    private estatusOperador: EstatusOperadorService,
    private estatusGruaService: EstatusGruaService,
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = this.tokenService.getNombreUsuario();
    this.idUser = this.tokenService.getIdUsuario();
    this.cargarServicios();
    this.cargarOperadores();
    this.cargarGruas();
    this.cargarChart();
  }

  cargarChart(){
    const colors = [
      '#FF5733', // Color 1
      '#33FFC7', // Color 2
      '#FF33F9', // Color 3
      // Agrega más colores según la cantidad de clientes que tengas
    ];
    this.serviceService.getServiciosPorClienteTipo().subscribe(
      (response: any) => {
        this.data = {
          labels: response.data.map((item: any) => item.clienteTipoNombre),
          datasets: [
            {
              data: response.data.map((item: any) => parseInt(item.cantidad)), // Convertir a números
              backgroundColor: response.data.map((item: any, index: number) => colors[index % colors.length]), // Asignar colores
              hoverBackgroundColor: response.data.map((item: any, index: number) => colors[index % colors.length]) // Asignar colores
            }
          ]
        };
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );

    
    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
        
          }
        }
      }
    };
  }
  

  cargarServicios(): void {
    const hoy = moment().startOf('day').format('YYYY-MM-DD');
    console.log('Hoy:', hoy);

    this.serviceService.lista().subscribe(
      (data) => {
        console.log('Data recibida:', data);

        this.servicios = data.filter(serv => {
          const fechaServicio = moment(serv.fecha).startOf('day').format('YYYY-MM-DD');
          console.log('Fecha del servicio:', fechaServicio, 'Estado:', serv.estadoServicio);
          return fechaServicio === hoy && serv.estadoServicio === 'FINALIZADO';
        });

        this.serviciosRecientes = data.filter(serv => {
          const fechaServicio = moment(serv.fecha).startOf('day').format('YYYY-MM-DD');
          console.log('Fecha del servicio reciente:', fechaServicio, 'Estado:', serv.estadoServicio);
          return fechaServicio === hoy && serv.estadoServicio !== 'FINALIZADO';
        });

        this.gananciasDiarias = 0; // Reiniciar el contador de ganancias diarias

        this.servicios.forEach(ser => {
          this.gananciasDiarias += ser.montoCobrado;
        });

        console.log('Servicios cargados:', this.servicios.length);
        console.log('Servicios recientes cargados:', this.serviciosRecientes.length);
        this.listaVacia = undefined;
      },
      (err) => {
        this.listaVacia = err?.error?.message || 'Error al cargar servicios';
      }
    );
  }

  cargarOperadores(): void {
    this.operadorService.lista().subscribe(
      (data) => {
        this.operadores = data.filter(operador => operador.eliminado === 0);
        this.categorizarOperadores();
        console.log('Carga de operadores completada');
      },
      (err) => {
        this.listaVacia = err?.error?.message || 'Error al cargar operadores';
      }
    );
  }

  cargarGruas(): void {
    this.gruaService.lista().subscribe(
      (data) => {
        this.gruas = data.filter(grua => grua.eliminado === 0);
        this.categorizarGruas();
        console.log('Gruas cargadas:', this.gruas.length);
      },
      (err) => {
        this.listaVacia = err?.error?.message || 'Error al cargar grúas';
      }
    );
  }

  private categorizarOperadores(): void {
    this.operadores.forEach(operador => {
      this.estatusOperador.obtenerEstatusOperador(operador.id).subscribe(
        (nombreEstatus) => {
          if (nombreEstatus.nombreEstatus === 'Libre') {
            this.operadoresLibres.push(operador);
          } else if (nombreEstatus.nombreEstatus === 'Ocupado') {
            this.operadoresOcupados.push(operador);
          }
          console.log('Operadores libres:', this.operadoresLibres.length);
          console.log('Operadores ocupados:', this.operadoresOcupados.length);
        },
        (error) => {
          console.error('Error al obtener estado del operador:', error);
        }
      );
    });
  }

  private categorizarGruas(): void {
    this.gruas.forEach(grua => {
      this.estatusGruaService.obtenerEstatusGrua(grua.noEco).subscribe(
        (nombreEstatus) => {
          if (nombreEstatus.nombreEstatus === 'Libre') {
            this.gruasLibres.push(grua);
          } else if (nombreEstatus.nombreEstatus === 'Ocupada') {
            this.gruasOcupadas.push(grua);
          }
          console.log('Gruas libres:', this.gruasLibres.length);
          console.log('Gruas ocupadas:', this.gruasOcupadas.length);
        },
        (error) => {
          console.error('Error al obtener estado de la grúa:', error);
        }
      );
    });
  }

}
