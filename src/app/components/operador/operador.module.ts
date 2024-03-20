import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperadorComponent } from './operador.component';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../interceptors/token-interceptor.service';



@NgModule({
  declarations: [
    OperadorComponent
  ],
  imports: [
    CommonModule,
    SharedModule 
  ],
  exports: [
    OperadorComponent
  ],
  
})
export class OperadorModule { }
