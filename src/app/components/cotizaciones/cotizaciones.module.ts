import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionesComponent } from './cotizaciones.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [CotizacionesComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CotizacionesComponent
  ],
})
export class CotizacionesModule { }
