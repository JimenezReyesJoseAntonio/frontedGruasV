import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { OperadorComponent } from './components/operador/operador.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';


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
      path:'dashboard',
      component:DashboardComponent
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
