import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TiposVehiculo } from '../models/tiposVehiculo';

@Injectable({
  providedIn: 'root'
})
export class TiposVehiculoService {
  tiposVURL = environment.tiposVehiculoURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<TiposVehiculo[]> {
    return this.httpClient.get<TiposVehiculo[]>(`${this.tiposVURL}`);
  }
}
