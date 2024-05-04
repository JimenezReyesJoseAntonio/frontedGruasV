import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { EstatusDto } from '../models/estatus.dto';

@Injectable({
  providedIn: 'root'
})
export class EstatusOperadorService {
  estatusOperadorURL = environment.estatusOperador;

  constructor(private http: HttpClient) { }

  asignarEstatusOperador(idOperador: number, estado: string): Observable<void> {
    console.log('URL de la solicitud:', `${this.estatusOperadorURL}${idOperador}`);

    const body = { idOperador, estado };
    return this.http.post<any>(`${this.estatusOperadorURL}${idOperador}`, body).pipe(
      
      catchError((error: any) => {

        throw new Error('Error al asignar estado al operador: ' + error.message);

      })
    );
  }

  // recibe como respuesta un valor json para que no tenga error la respuesta obtenida del servidor.
  obtenerEstatusOperador(idOperador: number): Observable<{ nombreEstatus: string } | null> {
    return this.http.get<{ nombreEstatus: string }>(`${this.estatusOperadorURL}${idOperador}`).pipe(
      catchError((error: any) => {
        throw new Error('Error al obtener estado del operador: ' + error.message);
      })
    );
  }
  
  public lista(): Observable<EstatusDto[]> {
    return this.http.get<EstatusDto[]>(`${this.estatusOperadorURL}`);
  }
}
