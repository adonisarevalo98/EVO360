import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import {UsersService} from 'src/app/services/users.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentsService } from 'src/app/services/departments.service';
import { EmploymentsService } from 'src/app/services/employments.service';
import { CompaniesService } from 'src/app/services/companies.service';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  public user = this.authService.getuserSession();

  /****************************************** VARIABLES LOCALES **************************************** */

  //para carga de pantalla
  public load: boolean;

  //objeto que almacena los datos del empleado para editarlos en la bdd
  userData = {
    id: 0,
    name: "",
    last_name: "",
    email:"",
    password:"",
   avatar: "",
   id_user_category:null,
   id_employment:null,
   status:null,
   id_department:null,
   id_company:null,
   newpassword:""
  }

  //cargando categorias para usuario
 user_categories=null;

 //cargando status para usuarios
 user_status;

 //Arreglo que almacena la lista de empresas disponibles
companies:any;

//Variables que almacenan el id y nombre de la empresa seleccionada
id_company=null;
name_company;

//Arreglo que almacena la lista de departamentos segun la empresa seleccionada
departments:any;

// Variable que almacena el id del departamento seleccionado 
department_id = '';

//Arreglo que almacena la lista de cargos disponibles
employments:any;

//Arreglo que almacena el cargo inicial y la lista de cargos según el departamento seleccionado 
employments_dept;


/********************************************************************************************************* */

  constructor(public authService: AuthService, public userService: UsersService,
    public toastr: ToastrService, public localService: LocalstorageService,
    public departmentService: DepartmentsService, public employmentService: EmploymentsService,
    public companyService:CompaniesService) { 
  
  }
   
    ngOnInit() {
      //Deshabilitamos la visualización del formulario y se muestra el spinner
        this.load = false;
      //Solicitamos el id del usuario a editar desde el localStorage
      let codUser =  this.localService.getSelectedId();
      console.log(this.localService.getSelectedId())
      //si hay un usuario seleccionado para editar
      if(codUser!=null){
    
      //Llamada al método para lista de estados de usuario
      this.ListStatus();
      //Llamada al método para lista de categorias de usuario
      this.ListCategories();

      //Llamada al método "select" para cargar datos en el formualrio
      this.chargeForm(codUser);

      //Llamada al método para lista de empresas
      this.List_Companies();
    }else{
      //Habilitamos el formualrio pero con los campos vacios
      this.load=true;
    }
    }

/********************************************************************************************************* */
 //Método de consulta a la API para obtener datos del usuario y cargar el formulario   
chargeForm(codUser){
     //Se utiliza el metodo "select" del users.service para llenar el formulario con los datos actuales
      this.userService.select(parseInt(codUser)).subscribe(result => {
         //se llena todo el formulario menos el campo de departamento y cargo
         this.userData = result[0];
         //forzamos la lista de departamentos con el id_company actual,
         // para llenar el select al cargar la componente
          this.List_Departments(result[0].id_company);
          //forzamos la lista de cargos con el id_department actual,
          // para llenar el select al cargar la componente
          this.List_Employments(result[0].id_department);
        //Timmer para espera de carga de datos
        setTimeout(() => {
         //habilitamos vista de formulario
          this.load = true;
          //Limpiamos el localstorage
          this.localService.deleteSelectedId();
        }, 3000);
      });
    }

    /********************************************************************************************************* */
    //Método para listar a las empresas disponibles (activadas o desactivadas)
    List_Companies(){
      this.companyService.list().subscribe(data=>{
        this.companies = data;
      })
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
     //Uso del método "list_status" para obtener los estados de usuario
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
 
  update() {
    console.log(this.userData)
    
    //Validamos si se introdujo una nueva contraseña
    if( this.userData.hasOwnProperty( 'newpassword' ) && (this.userData.newpassword!="")){
      this.userData.password = this.userData.newpassword;
    }

    //Se utiliza el metodo "update" del users.service para realizar el PUT en la API 
    this.userService.update(this.userData).subscribe(data => {    
      if (data['result'] == 'OK') {
        this.toastr.success('Usuario actualizado con exito', 'Perfecto!');
      
       //Limpieza del formulario
  this.userData= {
    id: 0,
    name: "",
    last_name: "",
    email:"",
    password:"",
   avatar: "",
   id_user_category:null,
   id_employment:null,
   status:null,
   id_department:null,
   id_company:null,
   newpassword:""
  }
      }else if(data['result'] == 'DENIED'){
        this.toastr.error('El correo ingresado ya está en uso', 'Error!');
      }else if(data['result'] == 'NO'){
        this.toastr.error('Formato de correo o contraseña erróneo', 'Error!');
      }else if(data['result'] == 'ERROR'){
        this.toastr.error('No se ha podido resolver la petición', 'Error!');
      }
  
      });
      
    }
   
}
