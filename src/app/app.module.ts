import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HttpClient, provideHttpClient, withFetch, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { OperadorComponent } from './components/operador/operador.component';//lo borre share module
import { OperadorModule } from './components/operador/operador.module';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GruaComponent } from './components/grua/grua.component';
import { GruaModule } from './components/grua/grua.module';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LayoutComponent,
    LoginComponent,
    DashboardComponent,
    
    
  ],
  imports: [
    
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    AppRoutingModule,
    SidebarModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    CardModule,
    ReactiveFormsModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    OperadorModule,
    GruaModule,
    IconFieldModule,
    InputIconModule

  ],
  providers: [

    provideHttpClient(withFetch()),
    provideClientHydration(),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
