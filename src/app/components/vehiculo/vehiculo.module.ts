import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoComponent } from './vehiculo.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    VehiculoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    VehiculoComponent
  ],
})
export class VehiculoModule { }
