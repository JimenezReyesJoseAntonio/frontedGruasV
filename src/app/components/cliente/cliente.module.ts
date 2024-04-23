import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteComponent } from './cliente.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ClienteComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ClienteComponent
  ],
})
export class ClienteModule { }
