import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../../services/auth.service";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 //authdata es el nombre de la clase donde se almacena el formulario del log in
  //a traves de el se almacenan los datos ingresados en el formulario.
  authdata! : FormGroup;
  submitted = false;
 
  
  constructor(public authservice:AuthService,private formBuilder: FormBuilder, 
    private http:HttpClient, private router:Router,public toastr: ToastrService) { }

  ngOnInit(): void {
    //a partir de la clase conctact se validan los campos que debe contener
    // los campos del formBuilder deben coincidir con la clase formControlName en los inputs del HTML
    this.authdata = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

  });
  }

  get f() { return this.authdata.controls; }
  IniciarSeccion() { //evento activado con el boton "Iniciar Sesión"

      this.submitted = true;
      
      if (this.authdata.invalid) {
          return;
      }
      //alert('Mensaje Enviado !'+JSON.stringify(this.contacto.value))
    //  console.log('Mensaje Enviado !'+JSON.stringify(this.contacto.value))
        this.Iniciar_seccion(this.authdata);

  
        
  }
  ventana4(){

    this.ventana4();

}

 

Iniciar_seccion(authdata: FormGroup){

  this.authservice.userlogin(authdata.value.email,authdata.value.password).subscribe(
    data => {

    },
    error => {this.toastr.error('No se ha podido resolver la petición', 'Error!');
  }
  );
}
}
