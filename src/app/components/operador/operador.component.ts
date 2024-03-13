import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Operador } from '../../models/operador';
import { OperadorService } from '../../services/operador.service';

interface Product {
  code: string;
  name: string;
  category: string;
  quantity: number;
} 

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrl: './operador.component.css',
  providers: [MessageService]

})
export class OperadorComponent implements OnInit{
  operadores: Operador[] = [];
  listaVacia: string | undefined;

  productDialog: boolean = false;
  constructor(private messageService: MessageService,
    private operadorService: OperadorService
    ) {}


  ngOnInit(): void {
    this.cargarOperadores();

  }

  show() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  cargarOperadores(): void {
    this.operadorService.lista().subscribe(
      data => {
        this.operadores = data;
        this.listaVacia = undefined;
      },
      err => {
        this.listaVacia = err.error.message;
      }
    );
  }

  products: Product[] = [
    { code: '001', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: '002', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: '003', name: 'Product 3', category: 'Category 1', quantity: 15 },
    // Agrega más datos de productos si lo necesitas
  ];

  showDialog() {
    this.productDialog = true;
  }

}
