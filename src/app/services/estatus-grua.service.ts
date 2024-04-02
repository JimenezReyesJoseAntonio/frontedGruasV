import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EstatusGruaDto } from '../models/estatusGrua.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstatusGruaService {

  estatusGruaURL = environment.estatusGruaURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<EstatusGruaDto[]> {
    return this.httpClient.get<EstatusGruaDto[]>(`${this.estatusGruaURL}`);
  }
}
