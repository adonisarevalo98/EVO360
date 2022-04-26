import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CriteriaGroupsService } from 'src/app/services/criteria-groups.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-criteria-groups',
  templateUrl: './list-criteria-groups.component.html',
  styleUrls: ['./list-criteria-groups.component.css']
})
export class ListCriteriaGroupsComponent implements OnInit {
//Cargando propiedades de material (Paginator y sort) del Mat-table
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

public user = this.authService.getuserSession();

/****************************************** VARIABLES LOCALES **************************************** */

//Columnas de la tabla
displayedColumns = ['title', 'description','algorithm', 'action'];

//arreglo para listar a todas las grupos de criterios
critgroups=new MatTableDataSource();

//arreglo en formato mat-table para listar departamentos segun la empresa seleccionada
 algorithms; 
 alg_description=""; //Variable que almacena la descripcion del algoritmo seleccionado

//Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
method=1; 

 //variable que almacena lo digitado en el buscador 
 text: string;

 //Formulario
 form: FormGroup;

 //Para subida de logo 
 title_img = 'logo';
 filedata:any;
   fileEvent(e){
       this.filedata = e.target.files[0];
   }

/********************************************************************************************************* */
constructor(public authService:AuthService, public critGroupService:CriteriaGroupsService,
  public formBuilder:FormBuilder, public toastr:ToastrService,
  public localService:LocalstorageService) {
 //Construllendo formulario
 this.buildForm();

 }
 /********************************************************************************************************* */
   //Construcción del formulario
   buildForm() {

    this.form= new FormGroup({
      id: new FormControl(),
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', []),
      algorithm: new FormControl('', [Validators.required]),
    });
  }
  get id(){return this.form.get('id')}
  get title(){return this.form.get('title');}
  get description(){return this.form.get('description');}
  get algorithm(){return this.form.get('algorithm');}

/********************************************************************************************************* */
ngOnInit(): void {
  //invocando método para lista de grupos de criterios
  this.ListCritGroups();
  //Invocando método para lista de algoritmos
  this.ListAlgorithms();
}
/********************************************************************************************************* */
 //Uso del método "list" para obtener la lista de grupos de criterios
 ListCritGroups(): void {
  this.critGroupService.list().subscribe((result) =>{
    this.critgroups = result;
  });
  }
/********************************************************************************************************* */
 //Uso del método "list" para obtener la lista de algoritmos de calculo
 ListAlgorithms(): void {
  this.critGroupService.algorithm_list().subscribe((result) =>{
    this.algorithms = result;
  });
  }
/********************************************************************************************************* */
  AlgListselectChangeHandler(event){
    this.algorithms.forEach(element => {
      if(event.target.value==element.id){
        this.alg_description=element.description;
      }
    });
  }

  /********************************************************************************************************* */

    //metodo que consume el servicio depsCompanies.service para agregar un nuevo departamento
insert() {

this.form.markAllAsTouched();
if(this.form.valid){      
  //Ejecución del metodo create para registrar departamento  
 this.critGroupService.create(this.form.value).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('Empresa registrada con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista de departamentos
this.ListCritGroups();


}else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar esta empresa', 'Error!');
}else if(data['result']=='NO'){
  this.toastr.error('El nombre de la empresa ya está en uso', 'Error!');
}
});
}
}

/********************************************************************************************************* */
 //Método que carga los datos del departamento seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.critGroupService.select(code).subscribe(data=>{
    this.form.setValue({
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      algorithm: data[0].algorithm
    });
  });
 }

/********************************************************************************************************* */


//Se utiliza el metodo "update" del critgroups.service para realizar el PUT en la API 
   update(){          
console.log(this.form.value)
this.form.markAllAsTouched();
if(this.form.valid){
this.critGroupService.update(this.form.value).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('Grupo actualizado con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;
//recargamos la lista de grupos de criterios
this.ListCritGroups();


 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
}
   }

/********************************************************************************************************* */

  //método que consume el método "delete" en el depsCompanies.service para eliminar al usuario seleccionado
      delete(code) {
  //uso de sweetalert2 para validar el proceso 
  
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar este grupo de criterios,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.critGroupService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminada!',
                  'Los criterios han sido eliminados',
                  'success'
                )
              //recargamos la lista de grupos de criterios
                this.ListCritGroups();
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
          this.buildForm();
          
          
        }
 /********************************************************************************************************* */
       //Buscador
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.critgroups.filter = filterValue;
      }

    /********************************************************************************************************* */
         //Uso del localstorage service para "almacenar" el id y nombre de la evaluación seleccionada
         //la cual será consumida desde la componente list-evaluators
         list_criteria(id: number) {
         this.localService.setCritGroupId(id);
     }

}
