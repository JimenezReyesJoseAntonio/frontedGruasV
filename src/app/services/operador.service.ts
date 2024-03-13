import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operador } from '../models/operador';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  operadorURL = environment.operadorURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Operador[]> {
    return this.httpClient.get<Operador[]>(`${this.operadorURL}`);
  }

  public detail(id: number): Observable<Operador> {
    return this.httpClient.get<Operador>(`${this.operadorURL}${id}`);
  }

  public save(operador: Operador): Observable<any> {
    return this.httpClient.post<any>(`${this.operadorURL}`, operador);
  }

  public update(id: number, operador: Operador): Observable<any> {
    return this.httpClient.put<any>(`${this.operadorURL}${id}`, operador);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.operadorURL}${id}`);
  }


}
