import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../firestore.service';
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

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private firestoreService: FirestoreService){
    this.loginForm=this.fb.group({
      username: ['', Validators.required],
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
    } else {
      const datosIngresados=this.loginForm.value;

      this.firestoreService.getAll('admins').subscribe({
        next: (admins: any[]) => {
          //lo buscamos en administradores
          const admin=admins.find(admin => 
            admin.username===datosIngresados.username &&
            admin.email===datosIngresados.email &&
            bcrypt.compareSync(datosIngresados.password, admin.password)
          );
          
          if(admin){
            //si lo encuentra en admin, se lo mandamos a login y le decimos que es admin
            //y lo recibimos como admin
            this.loginService.login(admin, 'admin');
            Swal.fire({
              title: "Bienvenido administrador",
              icon: "success"
            }).then(() => {
              //redirige a home y luego recarga la pagina
              this.router.navigate(['/home']).then(() => {
                window.location.reload();
              });
            });
          } else {
            //si no esta en admins lo buscamos en users
            this.firestoreService.getAll('users').subscribe({
              next: (usuarios: any[]) => {
                const usuarioEncontrado=usuarios.find(user =>
                  user.username===datosIngresados.username &&
                  user.email===datosIngresados.email &&
                  bcrypt.compareSync(datosIngresados.password, user.password)
                );

                if(usuarioEncontrado){
                  this.loginService.login(usuarioEncontrado, 'user');
                  Swal.fire({
                    title: 'Bienvenido!',
                    icon: 'success'
                  }).then(() => {
                    this.router.navigate(['/home']).then(() => window.location.reload());
                  });
                } else {
                  //si llego aqui es pq no esta ni en admin ni en user
                  Swal.fire({
                    title: "Datos no encontrados!",
                    text: "Los datos ingresados no coinciden con ninguna de las credenciales registradas",
                    icon: "error"
                  });
                  this.loginForm.reset();
                }
              }
            });
          }
        }
      }); 
    } 
  }
}