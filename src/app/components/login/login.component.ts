import { Component, OnInit } from '@angular/core';
import { LoginUsuarioDto } from '../../models/login-usuario.dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]

})
export class LoginComponent implements OnInit {

  form: FormGroup;

  usuario: LoginUsuarioDto = null;


 
  rememberMe: boolean = false;
  
  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private messageService: MessageService
  ) { 
    this.form=this.fb.group({
      nombreUsuario:[null,[Validators.required]],
      password:[null,[Validators.required]]
      });
  }


  ngOnInit(): void {
   
  }
  
  onLogin(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        data => {
          if (!data.token) {
            console.error(data.response.message);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.response.message});
          } else {
            this.tokenService.setToken(data.token);
            this.router.navigate(['/dashboard']);
          }
        },
        err => {
          console.error(err.error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        }
      );
    } else {
      console.error('Formulario no válido');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Campos vacios' });

    }
  }
  
  
}
