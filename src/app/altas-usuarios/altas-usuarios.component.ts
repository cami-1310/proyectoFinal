import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-altas-usuarios',
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './altas-usuarios.component.html',
  styleUrl: './altas-usuarios.component.css'
})
export class AltasUsuariosComponent {
  registroForm: FormGroup;
  datosUsuarios: any[]=[];
  duplicado: boolean=false;

  constructor(private fb: FormBuilder, private router: Router, private  firestoreService: FirestoreService){
    this.registroForm=this.fb.group({
      nombreCompleto: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNum: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d_]{8,16}$/)]], 
      confirmPassword: ['', Validators.required]
    }, {validators: this.matchPasswords});
  }

  async guardarDatos(){
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        title: "Formulario inválido",
        text: "Por favor, completa todos los campos correctamente.",
        icon: "warning"
      });
      return;
    } else {
      this.datosUsuarios=await this.firestoreService.getAll('users');
      const datosIngresados=this.registroForm.value;
  
      const encontrado=this.datosUsuarios.find(registro => 
        registro.nombreCompleto===datosIngresados.nombreCompleto ||
        registro.username===datosIngresados.username ||
        registro.email===datosIngresados.email ||
        registro.phoneNum===datosIngresados.phoneNum
      )
  
      if(encontrado){
        Swal.fire({
          title: "Datos duplicados!",
          text: "Algunos de los datos que intentas registrar ya se encuentran en la base de datos.",
          icon: "error"
        });
      } else {
        const hashedPassword = await bcrypt.hash(datosIngresados.password, 10); //para encriptar la contraseña

        await this.firestoreService.add('users', {
          nombreCompleto: datosIngresados.nombreCompleto,
          username: datosIngresados.username,
          email: datosIngresados.email,
          phoneNum: datosIngresados.phoneNum,
          password: hashedPassword
        });

        Swal.fire({
          title: "Registrado!",
          text: "Tus datos se han guardado correctamente.",
          icon: "success"
        }).then(() => {
          //redirige a iniciar sesion y luego recarga la pagina
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        });
      }
      
      this.registroForm.reset();
    }
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
}