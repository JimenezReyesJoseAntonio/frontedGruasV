import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GruaComponent } from './grua.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [GruaComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    GruaComponent
  ],
  
})
export class GruaModule { }
