import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Vehiculo } from '../models/vehiculo';
import { Servicio } from '../models/servicio';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransaccionData } from '../models/transaccionData';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  transaccionURL = environment.transaccionURL;

  constructor(private httpClient: HttpClient) { }

  crearRegistroTransaccional(transaccionData: TransaccionData): Observable<any> {
    return this.httpClient.post<any>(this.transaccionURL, transaccionData);
  }
}
