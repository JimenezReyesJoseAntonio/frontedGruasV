import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private token:TokenService
  ) { }
  
  intercept(request:
    HttpRequest<any>,
    next:
    HttpHandler):
    Observable<HttpEvent<any>> {
    request = this.addToken(request);
    return next.handle(request);
    }
    private addToken(request: HttpRequest<unknown>){
    // Obtén el token de autenticación almacenado en el Local Storage
    const token=this.token.getToken();
    if (token) {
    //Clona la solicitud original y agrega el token al encabezado, s el token existe
    const authReq = request.clone({
    headers: request.headers.set('Authorization', token)
    });
    return authReq;
    }
    return request;
    }
}
