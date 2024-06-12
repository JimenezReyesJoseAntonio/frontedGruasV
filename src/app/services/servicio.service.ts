import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  servicioURL = environment.servicioURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(`${this.servicioURL}`);
  }

  public detail(id: number): Observable<Servicio> {
    return this.httpClient.get<Servicio>(`${this.servicioURL}${id}`);
  }

  public save(vehiculo: Servicio): Observable<any> {
    return this.httpClient.post<any>(`${this.servicioURL}`, vehiculo);
  }

  public update(id: number, servicio: Servicio): Observable<any> {
    return this.httpClient.put<any>(`${this.servicioURL}${id}`, servicio);
  }

  public upadateEstatus(id: number, campo: string, nuevoValor: any) {
    const url = `${this.servicioURL}${id}/${campo}`;
    return this.httpClient.put(url, { valor: nuevoValor });
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.servicioURL}${id}`);
  }

  public getServiciosPorClienteTipo(): Observable<any> {
    return this.httpClient.get<any>(`${this.servicioURL}por-cliente-tipo`);
  }


}
