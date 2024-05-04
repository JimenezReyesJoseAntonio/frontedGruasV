import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EstatusGruaDto } from '../models/estatusGrua.dto';

@Injectable({
  providedIn: 'root'
})
export class EstatusGruaService {
  estatusGruaURL = environment.estatusGrua;

  constructor(private http: HttpClient) { }

  asignarEstatusGrua(idGrua: number, estado: string): Observable<void> {
    console.log('URL de la solicitud:', `${this.estatusGruaURL}${idGrua}`);

    const body = { idGrua, estado };
    return this.http.post<any>(`${this.estatusGruaURL}${idGrua}`, body).pipe(
      
      catchError((error: any) => {

        throw new Error('Error al asignar estado al operador: ' + error.message);

      })
    );
  }

  // recibe como respuesta un valor json para que no tenga error la respuesta obtenida del servidor.
  obtenerEstatusGrua(idGrua: number): Observable<{ nombreEstatus: string } | null> {
    return this.http.get<{ nombreEstatus: string }>(`${this.estatusGruaURL}${idGrua}`).pipe(
      catchError((error: any) => {
        throw new Error('Error al obtener estado del operador: ' + error.message);
      })
    );
  }
  
  public lista(): Observable<EstatusGruaDto[]> {
    return this.http.get<EstatusGruaDto[]>(`${this.estatusGruaURL}`);
  }
}
