import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
 
  nombreUsuario: string;

  constructor( private tokenService: TokenService){  }

 
  ngOnInit(): void {
    this.nombreUsuario = this.tokenService.getNombreUsuario();
    
  }

}
