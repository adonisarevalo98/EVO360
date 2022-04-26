import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from 'src/app/services/users.service';
import { DepartmentsService } from 'src/app/services/departments.service';
import { EmploymentsService } from 'src/app/services/employments.service';
import { CompaniesService } from 'src/app/services/companies.service';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

/****************************************** VARIABLES LOCALES **************************************** */

  public user = this.authService.getuserSession();

  // inicializando contraseña por defecto
  default_pass = '';
 
 //cargando categorias para usuario
 user_categories=null;

 //cargando status para usuarios
 user_status=null;

//objeto que almacena los datos del usuario para insertarlos en la bdd
userData = {
  id: 0,
  name: "",
  last_name: "",
 avatar: "",
 email:"",
 password:"",
 confirmpass:"",
 id_user_category:3,
 id_employment:null,
 status:null
}

//Arreglo que almacena la lista de empresas disponibles
companies:any;

//Variables que almacenan el id y nombre de la empresa seleccionada
id_company=null;
name_company;

//Arreglo que almacena la lista de departamentos segun la empresa seleccionada
departments:any;

// Variable que almacena el id del departamento seleccionado 
department_id = '';


//Arreglo que almacena la lista de cargos segun la empresa y departamento seleccionado
employments=[];

/********************************************************************************************************* */

  constructor(public authService: AuthService, public userService:UsersService,
    public toastr: ToastrService, public departmentService: DepartmentsService,
    public employmentService: EmploymentsService, public companyService:CompaniesService) { }
    ngOnInit(){

      //Llamada al método para crear contraseña por defecto 
      this.default_password();
      //Llamada al método para lista de empresas
      this.List_Companies();
      //Llamada al método para lista de estados de usuario
      this.ListStatus();
      //Llamada al método para lista de categorias de usuario
      this.ListCategories();
     }
    /********************************************************************************************************* */
     //Metodo para generar una contraseña al azar 
    default_password(){
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$*-';
      const charactersLength = characters.length;
      for (let i = 0; i <= 8 ; i++) {
          this.default_pass += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      this.userData.password=this.default_pass;
    }
   /********************************************************************************************************* */
    //Método para listar a las empresas disponibles (activadas o desactivadas)
      List_Companies(){
        this.companyService.list().subscribe(data=>{
          this.companies = data;
        })
      }
     /********************************************************************************************************* */
     //Uso del método "list_status" para obtener los estados de evaluación
     ListStatus(){
       this.userService.list_status().subscribe((data)=>{
        this.user_status = data;
      });
     }
      /********************************************************************************************************* */
     //Uso del método "list_status" para obtener los estados de evaluación
     ListCategories(){
      this.userService.list_categories().subscribe((data)=>{
       this.user_categories = data;
     });
    }
    /********************************************************************************************************* */
     //Método para obtener lista de departamentos
    List_Departments(id){
      if((id!=null)&&(id!="")){
      this.departmentService.list_by_company(id).subscribe(data=>{
        this.departments = data;
      });
    }
    }
/********************************************************************************************************* */
    //Método para obtener lista de cargos según el departamento seleccionado
    List_Employments(id){
      if((id!=null)&&(id!="")){
      this.employmentService.list_by_department(id).subscribe(data=>{
      this.employments = data;
    });
  }
    }
/********************************************************************************************************* */
      //evento que se ejecuta tras seleccionar una empresa del select
  CompselectChangeHandler (event: any) {
    //limpiamos los cargos y departamentos tras cambiar de empresa
    this.department_id=null;
    this.userData.id_employment=null;
    this.employments=[];
    //almacenamos el id de la empresa seleccionada
    this.id_company=event.target.value;
    //Activamos el método para listar departamentos según el id
    this.List_Departments(this.id_company);
    
  
}
/********************************************************************************************************* */
    //evento que se ejecuta tras seleccionar un departemento del select
  DepselectChangeHandler (event: any) {
    //limpiamos el cargo seleccionado tras cambiar de departamento
    this.userData.id_employment=null;

     //almacenamos el id del departamento seleccionado
    this.department_id=event.target.value;
    //Activamos el método para listar departamentos según el id
    this.List_Employments(this.department_id);
    
 }
/********************************************************************************************************* */
 //metodo que consume el servicio users para agregar un nuevo usuario
 insert() {
   console.log(this.userData)
  //Validación de contraseña y su confirmación
  if (this.userData.confirmpass == this.userData.password){

     //Ejecución dle metodo create para registrar usuario  
    this.userService.create(this.userData).subscribe(data => {
  
  if (data['result'] == 'OK') {
    this.toastr.success('Usuario registrado con éxito', 'Perfecto!');
    //Descarga de archivo txt con credenciales
    this.download_credentials();
    //Limpieza del formulario
  this.userData =  {
    id: 0,
    name: "",
    last_name: "",
   avatar: "",
   email:"",
   password:"",
   confirmpass:"",
   id_user_category:3,
   id_employment:null,
   status:null
  };
    //Se genera una nueva contraseña por defecto
  this.default_pass = '';
  this.default_password();
  
  }else if (data['result'] == 'ERROR'){
  
    this.toastr.error('No se pudo registrar al usuario', 'Error!');
  }else if (data['result'] == 'NO'){
  
    this.toastr.error('Correo electrónico en uso o contraseña errónea', 'Error!');
  }
  });
}else{
  this.toastr.error('Las contraseñas no coinciden', 'Error!');
}
  }
  /********************************************************************************************************* */
  //metodo que descarga el correo y contraseña de la nueva cuenta
  download_credentials(){
    var date = Date.now();
   
    var fileContents = "Email: "+this.userData.email+" "+" "+"\n" +"Password: "+this.userData.password;
    var filename = date+"_"+this.userData.name+"_"+this.userData.last_name+".txt";
    var filetype = "text/plain";
    
    var a = document.createElement("a");
    let dataURI = "data:" + filetype +
        ";base64," + btoa(fileContents);
    a.href = dataURI;
    a['download'] = filename;
    var e = document.createEvent("MouseEvents");
    // Use of deprecated function to satisfy TypeScript.
    e.initMouseEvent("click", true, false,
        document.defaultView, 0, 0, 0, 0, 0,
        false, false, false, false, 0, null);
    a.dispatchEvent(e);
  
  }


}
