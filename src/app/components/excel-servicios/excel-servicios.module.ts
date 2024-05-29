import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelServiciosComponent } from './excel-servicios.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ExcelServiciosComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ExcelServiciosComponent
  ],
})
export class ExcelServiciosModule { }
