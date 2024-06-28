import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Grua } from '../models/grua';

@Injectable({
  providedIn: 'root'
})
export class GruaService {

  gruaURL = environment.gruaURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Grua[]> {
    return this.httpClient.get<Grua[]>(`${this.gruaURL}`);
  }

  public detail(id: number): Observable<Grua> {
    return this.httpClient.get<Grua>(`${this.gruaURL}${id}`);
  }

  public save(grua: Grua): Observable<any> {
    return this.httpClient.post<any>(`${this.gruaURL}`, grua);
  }

  public update(id: number, grua: Grua): Observable<any> {
    return this.httpClient.put<any>(`${this.gruaURL}${id}`, grua);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.gruaURL}${id}`);
  }

  public upadateKmGrua(id: number, campo: string, nuevoValor: any) {
    const url = `${this.gruaURL}${id}/${campo}`;
    return this.httpClient.put(url, { valor: nuevoValor });
  }

}
