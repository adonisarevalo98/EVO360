import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit {
//Cargando propiedades de material (Paginator y sort) del Mat-table
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

public user = this.authService.getuserSession();

/****************************************** VARIABLES LOCALES **************************************** */

//Columnas de la tabla
displayedColumns = ['Empresa', 'Estado', 'Acción'];

//arreglo para listar a todas las empresas
companies=new MatTableDataSource();

//arreglo en formato mat-table para listar departamentos segun la empresa seleccionada
 company_status; 

//Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
method=1; 

 //variable que almacena lo digitado en el buscador 
 text: string;

 //Formulario
 form: FormGroup;

 //Para subida de logo 
 title = 'logo';
 filedata:any;
   fileEvent(e){
       this.filedata = e.target.files[0];
   }

/********************************************************************************************************* */
constructor(public authService:AuthService, public companyService:CompaniesService,
  public formBuilder:FormBuilder, public toastr:ToastrService) {
 //Construllendo formulario
 this.buildForm();

 }
 /********************************************************************************************************* */
   //Construcción del formulario
   buildForm() {

    this.form= new FormGroup({
      id: new FormControl(),
      company: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      logo: new FormControl('', []),
      status: new FormControl('', [Validators.required]),
    });
  }
  get id(){return this.form.get('id')}
  get company(){return this.form.get('company');}
  get logo(){return this.form.get('logo');}
  get status(){return this.form.get('status');}

/********************************************************************************************************* */
ngOnInit(): void {
  //invocando método para lista de empresas
  this.ListCompanies();
  //Invocando método para lista de estados de empresa
  this.ListStatus();
}
/********************************************************************************************************* */
 //Uso del método "list" para obtener la lista de empresas
 ListCompanies(): void {
  this.companyService.list().subscribe((result) =>{
    this.companies = result;
  });
  }
/********************************************************************************************************* */
 //Uso del método "list" para obtener la lista de empresas
 ListStatus(): void {
  this.companyService.list_status().subscribe((result) =>{
    this.company_status = result;
  });
  }

  /********************************************************************************************************* */

    //metodo que consume el servicio depsCompanies.service para agregar un nuevo departamento
insert() {
  
//habilitamos el boton para crear en la modal
this.method =1;
this.form.markAllAsTouched();
if(this.form.valid){
  console.log(this.form.value)

  var myFormData = new FormData();
  myFormData.append('image', this.filedata);
  myFormData.append('data',this.form.value)
      
  //Ejecución del metodo create para registrar departamento  
 this.companyService.create(this.form.value).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('Empresa registrada con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista de departamentos
this.ListCompanies();


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

  this.companyService.select(code).subscribe(data=>{
    this.form.setValue({
      id: data[0].id,
      company: data[0].company,
      logo: data[0].logo,
      status: data[0].status
    });
  });
 }

/********************************************************************************************************* */


//Se utiliza el metodo "update" del companies.service para realizar el PUT en la API 
   update(){          
console.log(this.form.value)
this.form.markAllAsTouched();
if(this.form.valid){
this.companyService.update(this.form.value).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('Empresa actualizada con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;
//recargamos la lista de empresas
this.ListCompanies();


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
          text: "Esta a punto de eliminar esta empresa,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.companyService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminada!',
                  'La empresa ha sido eliminada',
                  'success'
                )
              //recargamos la lista de empresas
                this.ListCompanies();
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

       //Buscador
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.companies.filter = filterValue;
      }

}


