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
  

  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else {
      console.error('localStorage is not available salida');
    }
  }
  
}
