import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { BlockService } from '../block.service';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-resetpswd',
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './resetpswd.component.html',
  styleUrl: './resetpswd.component.css'
})
export class ResetpswdComponent {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private  firestoreService: FirestoreService, private blockService: BlockService){
    this.resetForm=this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d_]{8,16}$/)]], 
      confirmPassword: ['', Validators.required]
    }, {validators: this.matchPasswords});
  }

  matchPasswords(group: FormGroup) {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
      } else {
        if (confirmPassword.hasError('passwordsMismatch')) {
          confirmPassword.setErrors(null);
        }
        return null;
      }
    }
    return null;
  }

  guardar(){
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      Swal.fire({
        title: "Formulario inválido",
        text: "Por favor, completa todos los campos correctamente.",
        icon: "warning"
      });
      return;
    } else {
      const datos=this.resetForm.value;
      const hashedPassword = bcrypt.hashSync(datos.password, 10);

      //actualizamos contraseña
      const cambios = {
        password: hashedPassword,
        bloqueado: false
      };

      //buscar primero en admins mediante el username
      this.firestoreService.getAll('admins').subscribe({
        next: (admins: any[]) => {
          const admin = admins.find(a => a.username===datos.username);

          if (admin) {
            this.firestoreService.update('admins', admin.id, cambios).subscribe(() => {
              this.blockService.banderaBloqueado = false;
              Swal.fire({
                title: "Contraseña actualizada",
                text: "Tu cuenta de administrador ha sido desbloqueada.",
                icon: "success"
              }).then(() => this.router.navigate(['/login']));
            });
          } else {
            //si no es admin, buscar en users
            this.firestoreService.getAll('users').subscribe({
              next: (usuarios: any[]) => {
                const usuario = usuarios.find(u => u.username === datos.username);

                if (!usuario) {
                  Swal.fire({
                    title: "Usuario no encontrado",
                    text: "Verifica que el nombre de usuario esté registrado.",
                    icon: "error"
                  });
                  this.resetForm.reset();
                  return;
                }

                this.firestoreService.update('users', usuario.id, cambios).subscribe(() => {
                  this.blockService.banderaBloqueado = false;
                  Swal.fire({
                    title: "Contraseña actualizada",
                    text: "Tu cuenta ha sido desbloqueada, ya puedes iniciar sesión.",
                    icon: "success"
                  }).then(() => this.router.navigate(['/login']));
                });
              }
            });
          }
        }
      });
    }
  }
}