import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { OperadorComponent } from './components/operador/operador.component';


const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  
  { path: '', component: LayoutComponent,
  children:[
    {
      path:'operador',
      component:OperadorComponent
    }

  ]
}, // Define la ruta para LayoutComponent
  // Otras rutas pueden agregarse aquí según sea necesssssario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
