import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrl: './operador.component.css',
  providers: [MessageService]

})
export class OperadorComponent {
  constructor(private messageService: MessageService) {}

  show() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }
}
