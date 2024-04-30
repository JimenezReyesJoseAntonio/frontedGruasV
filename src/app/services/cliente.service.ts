import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  clienteURL = environment.clienteURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.clienteURL}`);
  }

  public detail(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.clienteURL}${id}`);
  }

  public save(cliente: Cliente): Observable<any> {
    return this.httpClient.post<any>(`${this.clienteURL}`, cliente);
  }

  public update(id: number, cliente: Cliente): Observable<any> {
    return this.httpClient.put<any>(`${this.clienteURL}${id}`, cliente);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.clienteURL}${id}`);
  }
}
