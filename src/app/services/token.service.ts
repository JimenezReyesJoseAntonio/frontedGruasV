import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  setToken(token: string): void {
      localStorage.setItem('token', token);
    
  }

   getToken(): string {
    const token = localStorage.getItem('token');
    //return token as string; // Afirmación de tipo para decirle a TypeScript que el valor nunca será null
    return token ? token : ''; // Devuelve un valor predeterminado si el token es null

  }
  
  getNombreUsuario(): string {
    if (!this.isLogged()) {
      console.log('no hay nombree');

      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = atob(payload);
    const valuesJson = JSON.parse(values);
    const nombreUsuario = valuesJson.nombreUsuario;
    return nombreUsuario;
  }

  
  getIdUsuario(): number {
    if (!this.isLogged()) {
      console.log('no hay id');

      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = atob(payload);
    const valuesJson = JSON.parse(values);
    const idUsuario = valuesJson.id;
    return idUsuario;
  }

  isAdmin(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = atob(payload);
    const valuesJson = JSON.parse(values);
    const roles = valuesJson.roles;
    return roles.includes('admin');
  }


  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else {
      console.error('localStorage is not available salida');
    }
  }
  
}
