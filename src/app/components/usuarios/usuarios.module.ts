import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    UsuariosComponent
  ],
})
export class UsuariosModule { }
