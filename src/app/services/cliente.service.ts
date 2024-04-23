import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientURL = environment.clientURL;
  constructor(private httpClient: HttpClient) { }


  public lista(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.clientURL}`);
  }

  public detail(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.clientURL}${id}`);
  }

  public save(grua: Cliente): Observable<any> {
    return this.httpClient.post<any>(`${this.clientURL}`, grua);
  }

  public update(id: number, cliente: Cliente): Observable<any> {
    return this.httpClient.put<any>(`${this.clientURL}${id}`, cliente);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.clientURL}${id}`);
  }
}



