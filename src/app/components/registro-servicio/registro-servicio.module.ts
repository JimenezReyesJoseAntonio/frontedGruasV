import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroServicioComponent } from './registro-servicio.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [RegistroServicioComponent],
  imports: [
    CommonModule,
    SharedModule
    
  ],
  exports: [
    RegistroServicioComponent
  ],
})
export class RegistroServicioModule { }
