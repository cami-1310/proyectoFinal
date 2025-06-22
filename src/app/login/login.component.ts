import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { FirestoreService } from '../firestore.service';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import Swal from 'sweetalert2';


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
    private auth: Auth
  ){
    this.loginForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async compararCredenciales(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos',
        icon: 'warning'
      });
      return;
    } else {
      const {email, password}=this.loginForm.value;

      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password);
        const userEmail = cred.user.email;
  
        //vemos si es admin
        this.firestoreService.getWhere('admins', [{ fieldPath: 'email', opStr: '==', value: userEmail }]).subscribe(admins => {
          if (admins.length > 0) {
            const admin = admins[0];
            if (admin.bloqueado) {
              //si llega aqui es porque ya pudo autenticarse
              //hay que desbloquearlo
              this.firestoreService.update('admins', admin.id, { bloqueado: false }).subscribe(() => {
                this.loginService.login(admin, 'admin');
                Swal.fire({ 
                  title: 'Bienvenido Administrador', 
                  icon: 'success' }).then(() => {
                    this.router.navigate(['/home']).then(() => {
                    window.location.reload();
                  });
                });
              });
            } else {
              //si no, pues ya lo encontró, es admin, lo dejamos pasar y avisamos que es admin
              this.loginService.login(admin, 'admin');
              Swal.fire({ 
                title: 'Bienvenido Administrador', 
                icon: 'success' }).then(() => {
                  this.router.navigate(['/home']).then(() => {
                  window.location.reload();
                });
              });
            }
            return;
          }
  
          //si no es admin, busca en users
          this.firestoreService.getWhere('users', [{ fieldPath: 'email', opStr: '==', value: userEmail }]).subscribe(users => {
            if (users.length > 0) {
              const user = users[0];
              if (user.bloqueado) {
                this.firestoreService.update('users', user.id, { bloqueado: false }).subscribe(() => {
                  this.loginService.login(user, 'user');
                  Swal.fire({ 
                    title: 'Bienvenido', 
                    icon: 'success' }).then(() => {
                      this.router.navigate(['/home']).then(() => {
                      window.location.reload();
                    });
                  });
                });
              } else {
                this.loginService.login(user, 'user');
                Swal.fire({ 
                  title: 'Bienvenido', 
                  icon: 'success' }).then(() => {
                    this.router.navigate(['/home']).then(() => {
                    window.location.reload();
                  });
                });
              }
            }
          });
        });
      } catch(error) {
        //si llega qui es que falló Firebase Auth, o sea, se equivocó al loguearse
        this.contador++;
        console.log(this.contador);
        if (this.contador > 3) {
          //si ya es 3, hay que bloquear y mandar correo para reestablecer
          //hay que buscar el correo en admins
          this.firestoreService.getWhere('admins', [{ fieldPath: 'email', opStr: '==', value: email }]).subscribe(admins => {
            if (admins.length > 0) {
              const admin = admins[0];
              this.firestoreService.update('admins', admin.id, { bloqueado: true }).subscribe(() => {
                this.enviarCorreoReset(email);
              });
            } else {
              //si no esta lo buscamos en users
              this.firestoreService.getWhere('users', [{ fieldPath: 'email', opStr: '==', value: email }]).subscribe(users => {
                if (users.length > 0) {
                  const user = users[0];
                  this.firestoreService.update('users', user.id, { bloqueado: true }).subscribe(() => {
                    this.enviarCorreoReset(email);
                  });
                } else {
                  //si llega aqui es que ya se equivoco 3 veces, pero ademas, los datos no estan en niguna coleccion
                  //hay que pedir que se registre
                  Swal.fire({
                    title: 'Usuario no encontrado',
                    text: 'Los datos que ingresaste no coinciden con los datos almacenados. Regístrate para poder iniciar sesión',
                    icon: 'error'
                  });
                  this.contador=0;
                }
              });
            }
          });
          this.loginForm.reset;
        } else {
          //si no es 3, hay que avisar del error, y cuantos intentos lleva
          Swal.fire({
            title: 'Credenciales incorrectas',
            text: `Correo o contraseña incorrectos. Intento ${this.contador}/3`,
            icon: 'error'
          });
          this.loginForm.reset;
        }
      }  
    }//else 
  }

  enviarCorreoReset(email: string) {
    sendPasswordResetEmail(this.auth, email).then(() => {
      Swal.fire({
        title: 'Cuenta bloqueada',
        text: 'Se ha enviado un correo para restablecer tu contraseña.',
        icon: 'error'
      });
    }).catch(() => {
      Swal.fire({
        title: 'Error al enviar correo',
        text: 'Verifica tu correo o intenta más tarde.',
        icon: 'error'
      });
    });
  }
}