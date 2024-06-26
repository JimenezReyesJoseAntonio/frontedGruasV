import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cotizacion } from '../models/cotizacion';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  cotizacionUrl = environment.cotizacionUrl;
  constructor(private httpClient: HttpClient) { }


  public lista(): Observable<Cotizacion[]> {
    return this.httpClient.get<Cotizacion[]>(`${this.cotizacionUrl}`);
  }

  public detail(id: number): Observable<Cotizacion> {
    return this.httpClient.get<Cotizacion>(`${this.cotizacionUrl}${id}`);
  }

  public save(cotizacion: Cotizacion): Observable<any> {
    return this.httpClient.post<any>(`${this.cotizacionUrl}`,cotizacion);
  }

  public update(id: number, cotizacion: Cotizacion): Observable<any> {
    return this.httpClient.put<any>(`${this.cotizacionUrl}${id}`, cotizacion);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.cotizacionUrl}${id}`);
  }
}
