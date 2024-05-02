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
    const body = { idOperador, estado };
    return this.http.post<void>(this.estatusOperadorURL, body).pipe(
      catchError((error: any) => {
        throw new Error('Error al asignar estado al operador: ' + error.message);
      })
    );
  }

  obtenerEstatusOperador(idOperador: number): Observable<string | null> {
    return this.http.get<string>(`${this.estatusOperadorURL}/${idOperador}`).pipe(
      catchError((error: any) => {
        throw new Error('Error al obtener estado del operador: ' + error.message);
      })
    );
  }

  public lista(): Observable<EstatusDto[]> {
    return this.http.get<EstatusDto[]>(`${this.estatusOperadorURL}`);
  }
}
