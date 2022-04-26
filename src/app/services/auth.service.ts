import { Injectable, NgZone, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ResourcesService} from './resources.service';
import { UsersService } from './users.service';
import {NgxEncryptCookieService} from 'ngx-encrypt-cookie'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  //Consumiendo el resources.service para conectarse con la bdd
  baseUrl:string = this.resourcesService.baseUrl;
   Key = this.resourcesService.Key;
  
   //Objeto que almacena los datos de sesion del usuario autenticado
   public userdata = null;
      
      @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
    constructor(
      
      public ngZone: NgZone, // Servicio NgZone para eliminar la advertencia de alcance externo
      public toastr: ToastrService,
      public router: Router,
      private httpClient : HttpClient,
      public resourcesService: ResourcesService,
      public userService: UsersService,
      private cookie:NgxEncryptCookieService,
    ) { }
    public userlogin(email:any, password:any) {
    
      //uso del recurso "login", con envio de parametros "email y password" para realizar la autenticación
      const headers = new HttpHeaders({'Content-Type':'application/json'}); 
      //Realizamos el proceso de autenticacion esperando captar en "Data" el token generado desde la API con Sanctum 
      return this.httpClient.post<any>(this.baseUrl + 'login', { email, password },{headers:headers}).pipe(map(Data => {
      // Si las credenciales son correctas recibimos el token en el objeto "Data"
        if(Data.access_token != null ){
           
          //consultamos los datos del usuario que se acaba de loguear mediante su email
          this.userService.getdata(email,Data.access_token).subscribe(
            data => {
              this.userdata = data[0];
    
              //Validamos el status del usuario
            if(this.userdata.status==2){
              this.toastr.error("Contacte con el administrador para solucionar este problema.", 'Su cuenta ha sido dada de baja!');

            }else if(this.userdata.status==1){
              //almacenamos el token desde la API en localstorage
              this.setToken(Data.access_token);
              //establecemos que el logeo se generó con exito
              this.getLoggedInName.emit(true);
              //almacenamos información básica + el email en objeto userData
              let userData = {
                id_usr:this.userdata.id,
                email:email,
                id_user_category: this.userdata.id_user_category ,
                name: this.userdata.name,
                last_name: this.userdata.last_name,
                id_company: this.userdata.id_company,
                company_status: this.userdata.company_status
              };
              //Almacenamos información básica de la empresa a la que pertenece el usuario autenticado
              
              //guardamos en una cookie cifrada la información básica del usuario
              this.cookie.set("usersession",JSON.stringify(userData),true,this.Key);
             
              //si el usuario es empleado se redirecciona segun su categoria de empleado
              //1=ADMINISTRADOR, 2=Gestor de evaluaciones 3= Empleado
              if(this.userdata.id_user_category == 1 ){
               
               window.location.href = '/admin-dashboard'
              }else if(this.userdata.id_user_category==2){
                window.location.href = '/manager-dashboard'
              }else if(this.userdata.id_user_category==3){
                window.location.href = '/employee-dashboard'
              }
        }
            });
            
         //Si las credenciales son incorrectas no se recibe un token
         //IMPORTANTE *********************************************************************************************************
         //BUSCAR METODO PARA LIMITAR EL NUMERO DE ACCESOS ERRONEOS
        }else{
          this.toastr.error("email o contraseña incorrecta.", 'Error!');
        }
  
       
        return Data;
      }));
      }
  
    //guardado de token
    setToken(token: string) {
    localStorage.setItem('token', token);
  
    }
  
    //obtencion de token
    getToken() {
    return localStorage.getItem('token');
    }
    //obtencion de los datos de sesión
    getuserSession() {
      try{
        return JSON.parse(this.cookie.get("usersession",true,this.Key));
      } catch ($e){
        window.location.href = "/login";
      }
        
    
      }
    //actualización de datos básicos tras actualizar el perfil
    updateInfo(){
      //obtenemos el id del usuario actualmente logueado
     let user = JSON.parse(this.cookie.get("usersession",true,this.Key));
     //consultamos a la API los datos básicos del usuario 
     this.userService.select(user.id_usr).subscribe(Users => {
        let userData = {
          id_usr:this.userdata.id,
          id_user_category: this.userdata.id_user_category ,
          name: this.userdata.name,
          last_name: this.userdata.last_name
        }
        //Limpiamos los datos actuales
        this.cookie.delete('usersession');
        //guardamos nuevamente en la cookie la información básica del usuario
        this.cookie.set("usersession",JSON.stringify(userData),true,this.Key);
      
    });
    
    }
    //eliminacion de token y datos básicos de usuario
    deleteToken() {
      try {
          //obtenemos el email del usuario autenticado 
   let email = this.getuserSession().email;
   //Eliminacion del token en la base de datos a traves del método "logout" en la API
   //con envio del parametro "email" para definir quien cierra sesión
   let headers= new HttpHeaders()
   .set('content-type', 'application/json')
   .set('Authorization','Bearer '+localStorage.getItem('token'));
   this.httpClient.post<any>(this.baseUrl + 'logout', {email},{headers:headers}).subscribe(data=>{
     console.log(email)
     //"status" es la respuesta que envia la API, true = logueo exitoso, false = fallo en el servidor
     //if(data['status']==true){
       //removemos el token y la cookie de la memoria
       /*localStorage.removeItem('token');
       this.cookie.delete('usersession');
       this.getLoggedInName.emit(false);
       window.location.href = '/login'*/
       //si falla el servidor
      //}else if(data['status']==false){
        localStorage.removeItem('token');
        this.cookie.delete('usersession');
        this.getLoggedInName.emit(false);
        window.location.href = '/login'
      //}
   });
      } catch (error) {
        
      }
    
    
    }
    //para saber si el usuario esta logueado o no, se evalua si existe un token y cookie de sesion
    isLoggedIn() {
    
    const usertoken = localStorage.getItem('token');
    const userdata = this.cookie.get("usersession",false);
    if ((usertoken != null)&&(userdata != null)&&(usertoken != "")&&(userdata != "")) {
      return true
    }
    return false;
    }
}
