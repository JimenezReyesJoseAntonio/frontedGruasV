import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { OperadorComponent } from './components/operador/operador.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GruaComponent } from './components/grua/grua.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { RegistroServicioComponent } from './components/registro-servicio/registro-servicio.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path:'login',
    component:LoginComponent
  },
  
  {
   canActivate:[authGuard],
   path: 'principal',
   component: LayoutComponent,
  children:[
    {
      path:'operador',
      component:OperadorComponent
    },
    {
      path:'grua',
      component:GruaComponent
    },
    {
      path:'dashboard',
      component:DashboardComponent
    },
    {
      path: 'servicios',
      component: ServiciosComponent,
      children: [
        {
          path: 'nuevo',
          component: RegistroServicioComponent
        },
        // Agrega más rutas hijas para otros componentes dentro de "servicios" si es necesario
      ]
    }

  ]
}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
