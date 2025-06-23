import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../login.service';
import { FirestoreService } from '../firestore.service';
import { BlockService } from '../block.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup;
  contador: number=0;

  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private router: Router, 
    private firestoreService: FirestoreService, 
    private blockService: BlockService, 
    private authService: AuthService
  ){
    this.loginForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  compararCredenciales(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos',
        icon: 'warning'
      });
      return;
    }
    
    const {email, password}=this.loginForm.value;

    this.authService.login(email, password).then(cred => {
      this.authService.getAdminByEmail(email).subscribe(admin => {
        if (admin?.bloqueado) {
          Swal.fire({
            title: 'Cuenta bloqueada',
            text: 'Tu cuenta está bloqueada. Restablece tu contraseña.',
            icon: 'error'
          });
          return;
        }

        this.loginService.login(admin, 'admin');
        Swal.fire('Bienvenido administrador', '', 'success').then(() => {
          this.router.navigate(['/home']).then(() => window.location.reload());
        });
      });
    }).catch(error=>{
      this.contador++;
      let mensaje = 'Error desconocido';

      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'Correo no registrado';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta';
          break;
      }

      Swal.fire('Error de autenticación', mensaje, 'error');

      if (this.contador == 3) {
        Swal.fire({
          title: '¿Olvidaste tu contraseña?',
          text: '¿Deseas restablecer tu contraseña ahora?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        }).then(result => {
          if (result.isConfirmed) {
            this.restablecerContrasena(email);
          }
        });
      }
    });
  }

  restablecerContrasena(email: string) {
    this.authService.resetPassword(email).then(() => {
      Swal.fire('Revisa tu correo', 'Te enviamos un enlace para restablecer tu contraseña.', 'info');
    }).catch(err => {
      console.error(err);
      Swal.fire('Error', 'No se pudo enviar el correo.', 'error');
    });
  }
}