import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EmploymentsService } from 'src/app/services/employments.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { CriteriaService } from 'src/app/services/criteria.service';
import { CriteriaGroupsService } from 'src/app/services/criteria-groups.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-list-criteria',
  templateUrl: './list-criteria.component.html',
  styleUrls: ['./list-criteria.component.css']
})
export class ListCriteriaComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */
  //para carga de pantalla
  public load: boolean;
  
 //Formulario
 form: FormGroup;

  //Columnas de la tabla
  displayedColumns = ['Criterion', 'Description', 'Percentage', 'Action'];

  //Variable que almacena el id del grupo de criterios, desde el localstorage
 id_critGroup=0;
 critGroup_name="";

  //arreglo para listar criterios de evaluación
  criteria = new MatTableDataSource();

 //Arreglo que almacena la lista de empresas disponibles
 companies:any;

 //Variable que almacena la suma de porcentajes para mostrar en la tabla
 suma=0.00;

  //Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
  method=1; 


/********************************************************************************************************* */
  constructor(public authService: AuthService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public criteriaService:CriteriaService, public CritGroupService:CriteriaGroupsService) { 
      //Construllendo formulario
 this.buildForm();
    }
    /********************************************************************************************************* */
   //Construcción del formulario
   buildForm() {

    this.form= new FormGroup({
      id: new FormControl(),
      criterion: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', []),
      percentage: new FormControl('', [Validators.required, Validators.min(0.00),
                                       Validators.max(100.00), Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]),
      group: new FormControl(this.id_critGroup, []),                                  
      
    });
  }
  get id(){return this.form.get('id')}
  get criterion(){return this.form.get('criterion');}
  get description(){return this.form.get('description');}
  get percentage(){return this.form.get('percentage');}
  get group(){return this.form.get('group');}
  

    
      ngOnInit(): void {
   //Obtenemos el id del grupo de criterios para listar sus criterios
   this.id_critGroup = this.localService.getCritGroupId();
 //Consultamos el nombre del grupo de criterios seleccionado
 this.CritGroupService.select(this.id_critGroup).subscribe(data=>{
  this.critGroup_name = data[0].title;
  });

        //Habilitamos la visualizacipon de la mat-table
        this.load = true;
        //invocando método para lista de criterios
        this.ListCriteria();  

      }
  /********************************************************************************************************* */
       //Uso del método "list" para obtener la lista de criterios 
       ListCriteria(): void {
        this.criteriaService. criteria_by_group(this.id_critGroup).subscribe((result) =>{
         this.criteria=result;
         //Suma de porcentajes
         let criteria_list=result;
         criteria_list.forEach(element => {
          console.log(element.percentage)
          this.suma += element.percentage;
        });
        });
        }

    /********************************************************************************************************* */
      //metodo que consume el servicio employments.service para agregar un nuevo grupo de criterios
 insert() {
   this.form.markAllAsTouched();

   
 console.log(this.form.value)
   if(this.form.valid){
   //habilitamos el boton para crear en la modal
this.method =1;

  //Ejecución del metodo create para registrar grupo de criterios
 this.criteriaService.create(this.form.value).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('grupo de criterios registrado con éxito', 'Perfecto!');
 console.log(data['response']);
//Limpieza del formulario
//this.clearForm();

//recargamos la lista 
this.ListCriteria();

}else if (data['result'] == 'NO'){
  this.toastr.error('Con el porcentage ingresado se supera el 100%', 'Error!');
 }else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar el grupo de criterios', 'Error!');
}
});
}

}
 /********************************************************************************************************* */

 //Método que carga los datos del criterio seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.criteriaService.select(code).subscribe(data=>{
    this.form.setValue({
      id: data[0].id,
      criterion: data[0].criterion,
      description: data[0].description,
      percentage: data[0].percentage,
      group: data[0].group
    });
  });
 }

 /********************************************************************************************************* */

//Se utiliza el metodo "update" del criteria.service para realizar el PUT en la API 
   update(){          

this.criteriaService.update(this.form.value).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('criterio actualizado con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//Recargamos la lista de criterios
this.ListCriteria();

 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
   }
 /********************************************************************************************************* */

  //método que consume el método "delete" en el criteria.service para eliminar al criterio seleccionado
      delete(code) {
  //uso de sweetalert2 para validar el proceso 
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar este criterio,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.criteriaService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'El criterio ha sido eliminado',
                  'success'
                )
              this.ListCriteria();
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
  this.buildForm();
}

 /********************************************************************************************************* */
         //Buscador
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.criteria.filter = filterValue;
      }


}
