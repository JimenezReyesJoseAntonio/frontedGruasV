import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  vehiculoURL = environment.vehiculoURL;


  constructor(private httpClient: HttpClient) { }
  
  public lista(): Observable<Vehiculo[]> {
    return this.httpClient.get<Vehiculo[]>(`${this.vehiculoURL}`);
  }

  public detail(id: number): Observable<Vehiculo> {
    return this.httpClient.get<Vehiculo>(`${this.vehiculoURL}${id}`);
  }

  public save(vehiculo: Vehiculo): Observable<any> {
    return this.httpClient.post<any>(`${this.vehiculoURL}`, vehiculo);
  }

  public update(id: number, vehiculo: Vehiculo): Observable<any> {
    return this.httpClient.put<any>(`${this.vehiculoURL}${id}`, vehiculo);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.vehiculoURL}${id}`);
  }

}
