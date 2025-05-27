import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup;
  datosCuenta: any[]=[];
  datosAdmin: any[]=[];
  accesoValido: boolean=false;

  constructor(private fb: FormBuilder, private adminService: AdminService, private loginService: LoginService, private router: Router){
    this.loginForm=this.fb.group({
      nombreCompleto: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  compararCredenciales(){
    if(this.loginForm.valid){
      const datosIngresados=this.loginForm.value;
      this.datosAdmin=this.adminService.getAdmins();

      const encontrado=this.datosAdmin.find(admin => 
        admin.nombreCompleto===datosIngresados.nombreCompleto &&
        admin.username===datosIngresados.username &&
        admin.password===datosIngresados.password
      );

      if(encontrado){
        this.accesoValido=true;
        this.loginService.login(encontrado);
      } else {
        this.accesoValido=false;
      }

      if(this.accesoValido){
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
        Swal.fire({
          title: "Datos no encontrados!",
          text: "Los datos ingresados no coinciden con ninguna de las credenciales de administrador.",
          icon: "error"
        });
      } 

      this.loginForm.reset();
    }
  }
}