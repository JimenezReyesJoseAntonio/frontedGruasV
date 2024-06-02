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
  }

  cargarServicios(): void {
    const hoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha en formato 'YYYY-MM-DD'

    this.serviceService.lista().subscribe(
      (data) => {
        this.servicios = data.filter(serv => {//cantidad de servicios finalizados
          const fechaServicio = new Date(serv.fecha).toISOString().split('T')[0]; // Convierte la fecha del servicio a 'YYYY-MM-DD'
          return fechaServicio === hoy && serv.estadoServicio === 'FINALIZADO';
        });

        this.serviciosRecientes = data.filter(serv => {
          const fechaServicio = new Date(serv.fecha).toISOString().split('T')[0]; // Convierte la fecha del servicio a 'YYYY-MM-DD'
          return fechaServicio === hoy && serv.estadoServicio !== 'FINALIZADO';
        });

        this.gananciasDiarias = 0; // Reiniciar el contador de ganancias diarias

        this.servicios.forEach(ser => {
          this.gananciasDiarias += ser.montoCobrado;

        });



        console.log('Servicios cargados:', this.servicios.length);
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
