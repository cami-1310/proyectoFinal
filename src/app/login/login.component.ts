import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { FirestoreService } from '../firestore.service';
// Importaciones para autenticación con email/password y reseteo
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
// Importaciones para autenticación con teléfono
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
// Importaciones para autenticación con Google
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import { Auth } from '@angular/fire/auth'; // Importación de Auth de @angular/fire/auth

import { NgxCaptchaModule } from 'ngx-captcha'
import { ReCaptcha2Component } from 'ngx-captcha';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [MatProgressSpinnerModule,FormsModule,RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  @ViewChild(ReCaptcha2Component) captchaElem!: ReCaptcha2Component;

  loginForm: FormGroup;
  contador: number=0;

  showPhoneLogin = false;
  phoneNumber = '';
  verificationCode = '';
  confirmationResult?: ConfirmationResult;
  recaptchaVerifier!: RecaptchaVerifier;

  isLoading:boolean=false;
@ViewChild('recaptchaContainer', { static: false }) recaptchaContainer!: any;



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
      Captcha: ['',Validators.required]
    });
  }

  async compararCredenciales(){
      this.isLoading = true;//para icono de carga
     // await new Promise(resolve => setTimeout(resolve, 3000));/////////////////////////////para calar icono de carga
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos',
        icon: 'warning'
      });
      this.isLoading = false;
      return;
    } else {
      const {email, password}=this.loginForm.value;

      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password);
        const userEmail = cred.user.email; // userEmail puede ser string | null
  
        this.handleSuccessfulLogin(userEmail); // Llamar a la función unificada de manejo de login
      } catch(error: any) { // Capturar el error para manejarlo
        console.error('Error al iniciar sesión con email/password:', error);
        // Firebase Auth errores comunes
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            this.contador++;
            if (this.contador >= 3) {
                // Si el usuario no se encuentra o la contraseña es incorrecta 3 veces, intentar bloquear
                const emailToCheck = this.loginForm.get('email')?.value;
                if (emailToCheck) {
                  this.firestoreService.getWhere('admins', [{ fieldPath: 'email', opStr: '==', value: emailToCheck }]).subscribe(admins => {
                    if (admins.length > 0) {
                      const admin = admins[0];
                      this.firestoreService.update('admins', admin.id, { bloqueado: true }).subscribe(() => {
                        this.enviarCorreoReset(emailToCheck);
                      });
                    } else {
                      this.firestoreService.getWhere('users', [{ fieldPath: 'email', opStr: '==', value: emailToCheck }]).subscribe(users => {
                        if (users.length > 0) {
                          const user = users[0];
                          this.firestoreService.update('users', user.id, { bloqueado: true }).subscribe(() => {
                            this.enviarCorreoReset(emailToCheck);
                          });
                        } else {
                          // Si el correo no existe en ninguna colección después de 3 intentos
                          Swal.fire({
                            title: 'Usuario no encontrado',
                            text: 'Los datos que ingresaste no coinciden con los datos almacenados. Regístrate para poder iniciar sesión',
                            icon: 'error'
                          });
                          this.contador = 0; // Reiniciar contador
                        }
                      });
                    }
                  });
                }
            } else {
                Swal.fire({
                    title: 'Credenciales incorrectas',
                    text: `Correo o contraseña incorrectos. Intento ${this.contador}/3`,
                    icon: 'error'
                });
            }
        } else {
            Swal.fire({
                title: 'Error de Autenticación',
                text: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
                icon: 'error'
            });
        }
        this.limpiarFormulario();
         this.isLoading = false;
      } finally{//para icono de carga
        this.isLoading = false;
      }
    }//else 
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const userEmail = result.user.email; 

      this.handleSuccessfulLogin(userEmail); 
      
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      let errorMessage = 'Ha ocurrido un error al iniciar sesión con Google.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'La ventana de Google fue cerrada por el usuario.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Ya existe una ventana de inicio de sesión abierta. Por favor, complétala.';
      }
      Swal.fire({
        title: 'Error de Autenticación con Google',
        text: errorMessage,
        icon: 'error'
      });
    }
  }


  // Ahora acepta userEmail como string o null
  private handleSuccessfulLogin(userEmail: string | null) {
    if (userEmail === null) {
      Swal.fire({
        title: 'Error de autenticación',
        text: 'No se pudo obtener el correo electrónico del usuario. Por favor, intenta con otro método o regístrate.',
        icon: 'error'
      }).then(() => {
        this.auth.signOut(); // Cerrar sesión si no hay email asociado
      });
      return;
    }

    // Primero, buscar en la colección de 'admins'
    this.firestoreService.getWhere('admins', [{ fieldPath: 'email', opStr: '==', value: userEmail }]).subscribe(admins => {
      if (admins.length > 0) {
        const admin = admins[0];
        // Si está bloqueado, desbloquearlo
        if (admin.bloqueado) {
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
          // Si no está bloqueado, simplemente loguearlo
          this.loginService.login(admin, 'admin');
          Swal.fire({ 
            title: 'Bienvenido Administrador', 
            icon: 'success' }).then(() => {
              this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          });
        }
        return; // Terminar aquí si es un administrador
      }
      
      // Si no es admin, buscar en la colección de 'users'
      this.firestoreService.getWhere('users', [{ fieldPath: 'email', opStr: '==', value: userEmail }]).subscribe(users => {
        if (users.length > 0) {
          const user = users[0];
          // Si está bloqueado, desbloquearlo
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
            // Si no está bloqueado, simplemente loguearlo
            this.loginService.login(user, 'user');
            Swal.fire({ 
              title: 'Bienvenido', 
              icon: 'success' }).then(() => {
                this.router.navigate(['/home']).then(() => {
                window.location.reload();
              });
            });
          }
        } else {
          // Si el correo no se encontró ni en admins ni en users después de una autenticación exitosa de Firebase
          Swal.fire({
            title: 'Usuario no registrado',
            text: 'Tu cuenta de Google se autenticó, pero no estás registrado en nuestra base de datos. Por favor, regístrate.',
            icon: 'error'
          }).then(() => {
            this.auth.signOut(); // Cerrar sesión de Firebase si el usuario no está en nuestra DB
          });
        }
      });
    });
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

  private limpiarFormulario(): void {
    this.loginForm.reset({
      email: '',
      password: '',
      Captcha: ''
    });
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();

    // Reiniciar el captcha visualmente
    if (this.captchaElem) {
      this.captchaElem.resetCaptcha();
    }

  }

  initRecaptcha() {
    if (!this.recaptchaVerifier) {
      if (this.recaptchaContainer && this.recaptchaContainer.nativeElement) {
        this.recaptchaVerifier = new RecaptchaVerifier(
          this.auth, 
          this.recaptchaContainer.nativeElement, 
          {
            size: 'normal', 
            callback: (response: any) => {
              console.log('reCAPTCHA resuelto:', response);
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expiró');
            }
          }
        );

        this.recaptchaVerifier.render().then((widgetId: number) => { 
          console.log('reCAPTCHA rendered with widget ID:', widgetId);
        });
      } else {
        console.error("No se encontró el elemento contenedor de reCAPTCHA. Asegúrate de que #recaptchaContainer esté en tu plantilla.");
      }
    }
  }


async verificarCodigo() {
  if (!this.confirmationResult) {
    Swal.fire('Error', 'Primero envía el SMS para obtener el código de verificación.', 'error');
    return;
  }
  this.isLoading = true; 

  try {
    const result = await this.confirmationResult.confirm(this.verificationCode);
    const user = result.user;
    const userPhoneNumber = user.phoneNumber; 

    if (userPhoneNumber) {
        await this.handleSuccessfulPhoneLogin(userPhoneNumber); 
    } else {
        Swal.fire({
            title: 'Error de autenticación',
            text: 'No se pudo obtener el número de teléfono del usuario.',
            icon: 'error'
        });
        this.auth.signOut();
        this.isLoading = false;
    }
  } catch (error) {
    console.error('Error al verificar código:', error);
    Swal.fire('Error', 'Código incorrecto o expirado. Intenta de nuevo.', 'error');
    this.isLoading = false; 
  }
}


async enviarSMS() { 
  if (!this.phoneNumber.startsWith('+')) {
    Swal.fire('Formato incorrecto', 'Incluye el prefijo del país. Ej: +52...', 'warning');
    return;
  }
  this.isLoading = true;


  setTimeout(async () => { 
    this.initRecaptcha();

    if (this.recaptchaVerifier) {
      try {
        const result = await signInWithPhoneNumber(this.auth, this.phoneNumber, this.recaptchaVerifier);
        this.confirmationResult = result;
        Swal.fire('Código enviado', 'Verifica tu teléfono', 'info');
      } catch (error) {
        console.error('Error al enviar SMS:', error);
        Swal.fire('Error', 'No se pudo enviar el código. Por favor, verifica el número o intenta de nuevo.', 'error');
      } finally {
        this.isLoading = false; 
      }
    } else {
      console.error('Recaptcha Verifier no inicializado. Revisa la plantilla y los tiempos.');
      Swal.fire('Error', 'No se pudo iniciar la verificación de reCAPTCHA. Intenta de nuevo.', 'error');
      this.isLoading = false;
    }
  }, 0); 
}
private async handleSuccessfulPhoneLogin(phoneNumber: string): Promise<void> {
    try {
      console.log(phoneNumber);
      const admins = await this.firestoreService.getWhere('admins', [{ fieldPath: 'phoneNumber', opStr: '==', value: phoneNumber }]).toPromise();

      
      if (admins && admins.length > 0) {
        const admin = admins[0];
        if (admin.bloqueado) {
          await this.firestoreService.update('admins', admin.id, { bloqueado: false }).toPromise();
        }
        this.loginService.login(admin, 'admin');
        Swal.fire({ 
          title: 'Bienvenido Administrador', 
          icon: 'success' }).then(() => {
            this.router.navigate(['/home']).then(() => {
            window.location.reload();
            this.isLoading = false; 
          });
        });
        return;
      }
      
      const users = await this.firestoreService.getWhere('users', [{ fieldPath: 'phoneNumber', opStr: '==', value: phoneNumber }]).toPromise();
      if (users && users.length > 0) {
        const user = users[0];
        if (user.bloqueado) {
          await this.firestoreService.update('users', user.id, { bloqueado: false }).toPromise();
        }
        this.loginService.login(user, 'user');
        Swal.fire({ 
          title: 'Bienvenido', 
          icon: 'success' }).then(() => {
            this.router.navigate(['/home']).then(() => {
            window.location.reload();
            this.isLoading = false; 
          });
        });
      } else {
        Swal.fire({
          title: 'Número de teléfono no registrado',
          text: 'Tu número de teléfono se autenticó, pero no está registrado en nuestra base de datos. Por favor, regístrate.',
          icon: 'error'
        }).then(() => {
          this.auth.signOut();
          this.isLoading = false; 
        });
      }
    } catch (error) {
      console.error('Error al manejar el login telefónico en Firestore:', error);
      Swal.fire({
        title: 'Error de base de datos',
        text: 'No se pudo verificar tu cuenta en nuestra base de datos. Intenta de nuevo.',
        icon: 'error'
      });
      this.auth.signOut();
      this.isLoading = false;
    }
  }

}