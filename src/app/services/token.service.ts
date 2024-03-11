import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setToken(token: string): void {
      localStorage.setItem('token', token);
    
  }

   getToken(): string {
    const token = localStorage.getItem('token');
    return token as string; // Afirmación de tipo para decirle a TypeScript que el valor nunca será null
  }
  
  
  
}
