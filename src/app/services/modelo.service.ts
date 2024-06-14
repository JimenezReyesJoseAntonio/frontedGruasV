import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Modelo } from '../models/modelo';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  modeloURL = environment.modeloURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Modelo[]> {
    return this.httpClient.get<Modelo[]>(`${this.modeloURL}`);
  }

  public save(modelo: Modelo): Observable<any> {
    return this.httpClient.post<any>(`${this.modeloURL}`, modelo);
  }

  public update(id: number, cliente: Modelo): Observable<any> {
    return this.httpClient.put<any>(`${this.modeloURL}${id}`, cliente);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.modeloURL}${id}`);
  }

}

