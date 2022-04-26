import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DepartmentsService } from 'src/app/services/departments.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-department',
  templateUrl: './list-department.component.html',
  styleUrls: ['./list-department.component.css']
})
export class ListDepartmentComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */

 //Columnas de la tabla
 displayedColumns = ['Departamento', 'Descripción', 'Acción'];

  //arreglo para listar a todas las empresas
  companies;

 //variable que almacena el id de la empresa seleccionada
 id_company=null;
 //variable que almacena el nombre de la empresa seleccionada
 name_company="";

  //arreglo que alamacena a todos los departamentos existentes
  departments;

   //objeto que almacena los departamentos que pertenecen a la empresa seleccionada
  depsList=[];

  //arreglo en formato mat-table para listar departamentos segun la empresa seleccionada
   depsCompanies = new MatTableDataSource();

  //objeto que almacena los datos del departamento para crear/modificar en la bdd
  depData={
    id:0,
    department:"",
    description:"",
    id_company: this.id_company
  };

  //Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
  method=1; 

   //variable que almacena lo digitado en el buscador 
   text: string;


/********************************************************************************************************* */
  constructor(public authService: AuthService, public depService: DepartmentsService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public companyService:CompaniesService) { }

    
      ngOnInit(): void {
        //invocando método para lista de empresas
        this.ListCompanies();
      }

/********************************************************************************************************* */

      //Uso del método "list" para obtener la lista de empresas
      ListCompanies(): void {
        this.companyService.list().subscribe((result) =>{
          this.companies = result;
        });
        }

/********************************************************************************************************* */
      //Uso del método "list_by_company" para obtener la lista de departamentos según la empresa seleccionada
      ListDepartments(id_company): void {
      this.depService.list_by_company(id_company).subscribe((result) =>{
       //Almacenamos en el arreglo tipo Mat-table a los departamentos de la empresa
       this.depsCompanies.data=result;
       this.depsCompanies.sort = this.sort;
       this.depsCompanies.paginator = this.paginator;
      } );
      }

/********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar una empresa del select (Para listar departamentos)
      CompListselectChangeHandler(event:any){
        //Guardamos el id de la empresa seleccionada
        this.id_company = event.target.value;
           
        //Activamos el método para cargar departamentos
        this.ListDepartments(this.id_company);
 
         //guardamos el nombre de la empresa seleccionada
         this.companies.forEach(element => {
           if(element.id == this.id_company){
             this.name_company = element.company;
           }
         });
      }
    

/********************************************************************************************************* */

      //metodo que consume el servicio depsCompanies.service para agregar un nuevo departamento
 insert() {
//habilitamos el boton para crear en la modal
this.method =1;

  //Ejecución del metodo create para registrar departamento  
 this.depService.create(this.depData).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('Departamento registrado con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista de departamentos
this.ListDepartments(this.id_company);


}else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar el departamento', 'Error!');
}
});
}

/********************************************************************************************************* */
 //Método que carga los datos del departamento seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.depService.select(code).subscribe(data=>{
    this.depData = data[0];
  });
 }

/********************************************************************************************************* */


//Se utiliza el metodo "update" del depsCompanies.service para realizar el PUT en la API 
   update(){          
console.log(this.depData)
this.depService.update(this.depData).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('Departamento actualizado con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;
//recargamos la lista de departamentos
this.ListDepartments(this.id_company);


 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
   }

/********************************************************************************************************* */

  //método que consume el método "delete" en el depsCompanies.service para eliminar al usuario seleccionado
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
            this.depService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'El departamento ha sido eliminado',
                  'success'
                )
              //recargamos la lista de departamentos
                this.ListDepartments(this.id_company);
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
        })

        }

/********************************************************************************************************* */
        //Método para limpiar formulario (antes de hacer un create y luego de hacer un update)
        clearForm(){
          //reseteamos el boton de la modal para mantener al metodo insert por defecto
          this.method=1;
          this.depData={
            id:0,
            department:"",
            description:"",
            id_company:this.id_company
          };
        }

       //Buscador
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.depsCompanies.filter = filterValue;
      }

}
