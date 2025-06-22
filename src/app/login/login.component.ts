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
import { BlockService } from '../block.service';
import {NgxCaptchaModule} from 'ngx-captcha'
//import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule,NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup;
  contador: number=0;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private firestoreService: FirestoreService, private blockService: BlockService){
    this.loginForm=this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      Captcha: ['',Validators.required]
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
            admin.email===datosIngresados.email
          );

          //si encuentra el user y email pero esta bloqueado
          if(admin?.bloqueado){
            Swal.fire({
              title: "Cuenta bloqueada",
              text: "Tu cuenta está bloqueada. Debes restablecer tu contraseña.",
              icon: "error"
            });
            return;
          }

          //si no, ya nada mas nos resta verificar que coincida la contraseña
          if(admin && bcrypt.compareSync(datosIngresados.password, admin.password)){
            //si lo encuentra, se lo mandamos a login y le decimos que es admin
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
                  user.email===datosIngresados.email
                );

                //si encuentra el user y email pero esta bloqueado
                if(usuarioEncontrado?.bloqueado){
                  Swal.fire({
                    title: "Cuenta bloqueada",
                    text: "Tu cuenta está bloqueada. Debes restablecer tu contraseña.",
                    icon: "error"
                  });
                  return;
                }

                //si encuentra el user y email ya nada mas hay que ver la contraseña
                if(usuarioEncontrado && bcrypt.compareSync(datosIngresados.password, usuarioEncontrado.password)){
                  this.loginService.login(usuarioEncontrado, 'user');
                  Swal.fire({
                    title: 'Bienvenido!',
                    icon: 'success'
                  }).then(() => {
                    this.router.navigate(['/home']).then(() => window.location.reload());
                  });
                } else {
                  //si llego aqui es pq no se encuentran coincidencias ni en admins ni en users

                  //pimero vemos cuantos intentos equivocados lleva
                  if(this.contador==3){
                    //si el contador es 3 es pq ya la bloqueo

                    //hay que buscar nuevamente
                    const adminPorUsername = admins.find(a => a.username === datosIngresados.username);

                    if (adminPorUsername) {
                      this.firestoreService.update('admins', adminPorUsername.id, { bloqueado: true }).subscribe(() => {
                        Swal.fire({
                          title: "Cuenta bloqueada",
                          text: "Demasiados intentos fallidos. Para desbloquear tu cuenta debes restablecer tu contraseña.",
                          icon: "error",
                          confirmButtonText: 'Restablecer contraseña'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.blockService.banderaBloqueado = true;
                            this.router.navigate(['/resetpswd']);
                          }
                        });
                      });
                      return;
                    }

                    this.firestoreService.getAll('users').subscribe({
                      next: (usuarios: any[]) => {
                        const usuarioPorUsername=usuarios.find(user => user.username===datosIngresados.username); //aqui tenemos el usuario que coincide con el user que ingreso

                        if(usuarioPorUsername){
                          this.firestoreService.update('users', usuarioPorUsername.id, {bloqueado: true} ).subscribe( () => {
                            Swal.fire({
                              title: "Cuenta bloqueada",
                              text: "Demasiados intentos fallidos. Para desbloquear tu cuenta debes reestablecer tu contraseña",
                              icon: "error",
                              confirmButtonText: 'Reestablecer contraseña'
                            }).then((result) => {
                              //lo mandamos a reestablecer la contra y avisamos que esta bloqueado
                              if (result.isConfirmed) {
                                this.blockService.banderaBloqueado=true;
                                this.router.navigate(['/resetpswd']);
                              }
                            });
                          });
                        }
                      }
                    });
                  } else {
                    //si no, nada mas indicamos que no esta en la BD
                    Swal.fire({
                      title: "Datos no encontrados!",
                      text: "Los datos ingresados no coinciden con ninguna de las credenciales registradas",
                      icon: "error"
                    });
                    this.contador++;
                    this.loginForm.reset();
                  }
                }
              }
            });
          }
        }
      }); 
    } 
  }
}