import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginUsuarioDto } from '../models/login-usuario.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURL = environment.authURL;

  constructor(private httpClient: HttpClient) { }
  
  login(dto: LoginUsuarioDto): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'login', dto);
  }

}
