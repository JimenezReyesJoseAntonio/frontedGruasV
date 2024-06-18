import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaServicioComponent } from './busqueda-servicio.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [BusquedaServicioComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    BusquedaServicioComponent
  ],
})
export class BusquedaServicioModule { }
