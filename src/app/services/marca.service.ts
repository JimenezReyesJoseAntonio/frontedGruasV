import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  marcaURL = environment.marcaURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Marca[]> {
    return this.httpClient.get<Marca[]>(`${this.marcaURL}`);
  }

  public save(marca: Marca): Observable<any> {
    return this.httpClient.post<any>(`${this.marcaURL}`, marca);
  }

}
