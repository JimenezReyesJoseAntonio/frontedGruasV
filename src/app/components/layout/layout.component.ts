import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent  implements OnInit{

  constructor(
    private tokenService: TokenService,
    private router: Router
  ){
    
  } 
  
  ngOnInit(): void {
  }
  sidebarVisible: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }


  logout() {
    // Implementación para cerrar sesión
    this.tokenService.logOut();
    this.router.navigate(['/login']);
  }
}
