import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ClienteTipo } from '../models/clienteTipo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientURL = environment.clientURL;
  constructor(private httpClient: HttpClient) { }


  public lista(): Observable<ClienteTipo[]> {
    return this.httpClient.get<ClienteTipo[]>(`${this.clientURL}`);
  }

  public detail(id: number): Observable<ClienteTipo> {
    return this.httpClient.get<ClienteTipo>(`${this.clientURL}${id}`);
  }

  public save(grua: ClienteTipo): Observable<any> {
    return this.httpClient.post<any>(`${this.clientURL}`, grua);
  }

  public update(id: number, cliente: ClienteTipo): Observable<any> {
    return this.httpClient.put<any>(`${this.clientURL}${id}`, cliente);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.clientURL}${id}`);
  }
}



