import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { EvaluatorsService } from 'src/app/services/evaluators.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-evaluators',
  templateUrl: './list-evaluators.component.html',
  styleUrls: ['./list-evaluators.component.css']
})
export class ListEvaluatorsComponent implements OnInit {

   //Cargando propiedades de material (Paginator y sort) del Mat-table
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
 
   public user = this.authService.getuserSession();
   
  /****************************************** VARIABLES LOCALES **************************************** */
 
    //Variable que será para desplegar el sidebar según la categoria de usuario
    $sidebar=null;

  //para carga de lista de evaluadores
  public load_t1: boolean;
  //para carga de lista de usuarios
  public load_t2: boolean;
  
  //Columnas de las tablas
  EvaluatorsColumns = ['#','Evaluador', 'Cargo','Nivel', 'Eliminar'];
  UsersColumns = ['#','Usuario', 'Cargo', 'Asignar'];

  //objeto que almacena el id y nombre de la empresa a la que pertenece el usuario actual
  companyData={
    id: 0,
    company:""
  }

  //Objeto que almacena el id y nombre de la evaluación seleccionada 
  evaluationData={
     id:0,
     title:""
   };
   //arreglo en formato mat-table para listar a los evaluadores de la evaluación
   evaluators = new MatTableDataSource();
 
   //arreglo en formato mat-table para listar usuarios de la empresa
    users = new MatTableDataSource();
 
   //objeto que almacena los datos del nuevo evaluador
   evaluatorData={
     id:0,
     id_user:0,
     id_evaluation:null,
     level: 2,
     status: 2
   };
 
 
 
 /********************************************************************************************************* */
  constructor(public authService: AuthService, public evtService:EvaluatorsService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public userService:UsersService) {

     }

  ngOnInit(): void {
          //Obteniendo id y nombre de la evaluación seleccionada para asignar evaluadores
this.evaluationData=JSON.parse(this.localService.getEvaluationId());

//Activamos metodo para obtener datos de empresa a la que pertenece el evaluado
this.getCompany(this.evaluationData.id);

//Activamos método para lista de evaluadores
this.ListEvaluators(this.evaluationData.id)
  
  }
 
/********************************************************************************************************* */
//Obteniendo empresa a la que pertenece el evaluado de la evaluación  
getCompany(id){

    this.evtService.companies_by_evaluated(id).subscribe(
      data=>{
        console.log(data);
             this.companyData=data[0];     
             
      });
  }

/********************************************************************************************************* */
//Obteniendo lista de evaluadores de la evaluación 
ListEvaluators(id){
  //Esperamos la carga de evaluadores
  this.load_t1 = false;
  this.evtService.evaluators_by_evaluation(this.user.id_usr,id).subscribe(
    data=>{
      console.log(data)
           this.evaluators.data=data;
           this.evaluators.paginator=this.paginator;
           this.evaluators.sort=this.sort;   
           //Timmer para espera de carga de datos
           setTimeout(() => {
            //habilitamos vista de la tabla
            this.load_t1 = true;
          }, 2000);     
    });
}

/********************************************************************************************************* */
//Obteniendo lista de usuarios pertenecientes a la misma empresa del evaluado
//pero que aún no son evaluadores en la evaluación actual
Listusers(){
  //Esperamos la carga de usuarios
  this.load_t2=false;
  this.userService.arent_evaluators(this.evaluationData.id, this.companyData.id).subscribe(
    data=>{
           this.users.data=data;
           this.users.paginator=this.paginator;
           this.users.sort=this.sort;       
           console.log(data)
           //Timmer para espera de carga de datos
           setTimeout(() => {
            //habilitamos vista de la tabla
            this.load_t2 = true;
          }, 2000);  
    });
}

/********************************************************************************************************* */
 //Buscador de evaluadores
 evaluatorsFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.evaluators.filter = filterValue;
}

/********************************************************************************************************* */
 //Buscador de evaluadores
 usersFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.evaluators.filter = filterValue;
}

/********************************************************************************************************* */
//Método para insertar un nuevo evaluador
Create(id_user){
  this.evaluatorData.id_evaluation=this.evaluationData.id;
  this.evaluatorData.id_user=id_user;
  //Esperamos la carga de evaluadores
  this.load_t1 = false;
  this.evtService.create(this.evaluatorData).subscribe(data=>{
    if(data['result']=='OK'){
      this.toastr.success('¡Registrado!');
      this.Listusers();
      //Despues de registrar un nuevo evaluador esperamos 3 segundos 
      //antes de refrescar la tabla de evaluadores
      setTimeout(() => {
        this.ListEvaluators(this.evaluationData.id);
      }, 3000);  
    }else if(data['result']=='ERROR'){
      console.log(data)
      this.toastr.error('¡Error!');
    }
  });
}

 /********************************************************************************************************* */
  //método que consume el método "delete" para eliminar a un evaluador
  delete(code) {
    //uso de sweetalert2 para validar el proceso 
          Swal.fire({
            title: '¡ALERTA!',
            text: "Este usuario dejará de ser evaluador,  ¿Desea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.evtService.delete(code).subscribe(data => {
                if (data['result'] == 'OK') {
                  Swal.fire(
                    'Eliminado!',
                    'Evaluador eliminado',
                    'success'
                  )
                this.ListEvaluators(this.evaluationData.id);
                }else if (data['result'] == 'ERROR'){
                  Swal.fire(
                    'Error!',
                    'No se pudo eliminar al evaluador',
                    'error'
                  )
                }
                });
              
            }
          })
  
          }
}
