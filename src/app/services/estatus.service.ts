import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstatusDto } from '../models/estatus.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstatusService {
estatusURL = environment.estatusURL;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<EstatusDto[]> {
    return this.httpClient.get<EstatusDto[]>(`${this.estatusURL}`);
  }
}
