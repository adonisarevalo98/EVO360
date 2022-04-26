import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EmploymentsService } from 'src/app/services/employments.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentsService } from 'src/app/services/departments.service';
import { CompaniesService } from 'src/app/services/companies.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-employment',
  templateUrl: './list-employment.component.html',
  styleUrls: ['./list-employment.component.css']
})
export class ListEmploymentComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */
  //para carga de pantalla
  public load: boolean;

  //Columnas de la tabla
  displayedColumns = ['Cargo', 'Descripción', 'Departamento', 'Acción'];

  //arreglo para listar cargos
  employments = new MatTableDataSource();

  //Arreglo que almacena la lista de departamentos disponibles
 departments:any;

 //Arreglo que almacena la lista de departamentos según la empresa seleccionada 
 depsCompany=[];

 //Variables que almacenan el id y nombre del departamento seleccionado
 id_department;
 name_department;

 //Arreglo que almacena la lista de empresas disponibles
 companies:any;

 //Variables que almacenan el id y nombre de la empresa seleccionada
 id_company;
 name_company;

  //objeto que almacena los datos del cargo para crear/modificar en la bdd
  empData={
    id:0,
    employment:"",
    description:"",
    id_department:null,
    department:""
  };


  //Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
  method=1; 


/********************************************************************************************************* */
  constructor(public authService: AuthService, public empService: EmploymentsService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public departmentService:DepartmentsService, public companyService:CompaniesService) { }

    
      ngOnInit(): void {
        //Habilitamos la visualizacipon de la mat-table
        this.load = true;
        //invocando método para lista de empresas
        this.ListCompanies();  

        //invocando método para lista de departamentos
        this.List_Departments();
      }
  /********************************************************************************************************* */
       //Uso del método "list" para obtener la lista de empresas 
       ListCompanies(): void {
        this.companyService.list().subscribe((result) =>{
         this.companies=result;
        } );
        }
          /********************************************************************************************************* */
      //Uso del método "list" para obtener la lista de cargos según la empresa seleccionada
      ListEmployments(id): void {
        this.load=false;
        this.empService.list_by_company(id).subscribe((result) =>{
          this.employments.data = result;
            this.employments.sort = this.sort;
            this.employments.paginator = this.paginator;
          //Timmer para espera de carga de datos
          setTimeout(() => {
            this.load = true;
          }, 2000);
        
      } );
    
      }

  /********************************************************************************************************* */
      //Método para obtener lista de departamentos
    List_Departments(){
      this.departmentService.list().subscribe(data=>{
      this.departments = data;
      });
    }

    /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar una empresa del select (Para listar cargos)
      CompListselectChangeHandler(event:any){
        //Guardamos el id de la empresa seleccionada
        this.id_company = event.target.value;
           console.log(this.id_company)
        //Activamos el método para lista de cargos por empresa
        this.ListEmployments(this.id_company);

        this.depsCompany=[];
        //listamos los departamentos que pertenecen a la empresa seleccionada
        this.departments.forEach(element => {
          if(element.id_company == this.id_company){
            this.depsCompany.push(element)
          }
        });

         //guardamos el nombre de la empresa seleccionada
         this.companies.forEach(element => {
           if(element.id == this.id_company){
             this.name_company = element.company;
           }
         });
      }

        /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar un departamento del select (Para listar cargos)
      DepListselectChangeHandler(event:any){
        //Guardamos el id del departamento seleccionado
        this.id_department = event.target.value;
      }

    /********************************************************************************************************* */
      //metodo que consume el servicio employments.service para agregar un nuevo cargo
 insert() {

  //Ejecución del metodo create para registrar cargo
 this.empService.create(this.empData).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('Cargo registrado con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista 
this.ListEmployments(this.id_company);

}else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar el cargo', 'Error!');
}
});

}
 /********************************************************************************************************* */

 //Método que carga los datos del departamento seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.empService.select(code).subscribe(data=>{
    this.empData = data[0];
  });
 }

 /********************************************************************************************************* */

//Se utiliza el metodo "update" del employments.service para realizar el PUT en la API 
   update(){          

this.empService.update(this.empData).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('Departamento actualizado con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;

//Recargamos la lista de departamentos
this.ListEmployments(this.id_company);

 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
   }
 /********************************************************************************************************* */

  //método que consume el método "delete" en el employments.service para eliminar al usuario seleccionado
      delete(code) {
  //uso de sweetalert2 para validar el proceso 
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar este departamento,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.empService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'El departamento ha sido eliminado',
                  'success'
                )
              this.ListEmployments(this.id_company);
              }else if (data['result'] == 'NO'){
                Swal.fire(
                  'Denegado!',
                  'Opción no disponible',
                  'error'
                )
              }else if (data['result'] == 'ERROR'){
                Swal.fire(
                  'Error!',
                  'No se ha podido procesar la solicitud',
                  'error'
                )
              }
              });
            
          }
        });

        }
 /********************************************************************************************************* */
        
 //Método para limpiar formulario (antes de hacer un create y luego de hacer un update)
 clearForm(){
  //reseteamos el boton de la modal para mantener el metodo de insertar por defecto
  this.method =1;

  this.empData={
    id:0,
    employment:"",
    description:"",
    id_department:null,
    department:""
  };
}

 /********************************************************************************************************* */
         //Buscador
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.employments.filter = filterValue;
      }

}
