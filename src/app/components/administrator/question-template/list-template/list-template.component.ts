import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { QuestionTemplatesService } from 'src/app/services/question-templates.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CriteriaGroupsService } from 'src/app/services/criteria-groups.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.css']
})
export class ListTemplateComponent implements OnInit {

   //Cargando propiedades de material (Paginator y sort) del Mat-table
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;

  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */

 //Columnas de la tabla
 displayedColumns = ['Tipo', 'Descripción', 'Estado', 'Acción'];

  //arreglo para listar templates
  question_templates = new MatTableDataSource();

  
 //cargando status para template
 template_status=null;

 //Arreglo que almacena la lista de grupos de criterios existentes
 crit_groups=null;


  //Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
  method=1; 

   //variable que almacena lo digitado en el buscador 
   text: string;

   //Formulario
   form: FormGroup;


/********************************************************************************************************* */
  constructor(public authService: AuthService, public tempService: QuestionTemplatesService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public critGroupService: CriteriaGroupsService) {
      //Construllendo formulario
 this.buildForm();
     }
  /********************************************************************************************************* */
   //Construcción del formulario
   buildForm() {

    this.form= new FormGroup({
      id: new FormControl(),
      type: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      group: new FormControl('', [])
    });
  }
  get id(){return this.form.get('id')}
  get type(){return this.form.get('type');}
  get description(){return this.form.get('description');}
  get status(){return this.form.get('status');}
  get group(){return this.form.get('group');}

  /********************************************************************************************************* */
      ngOnInit(): void {
        //invocando método para lista de templates
        this.ListTemplates();
        //invocando método para lista de estados
        this.ListStatus();
        //invocando método para lista de grupos de criterios
        this.ListCriteriaGroups();
      }

/********************************************************************************************************* */
      //Uso del método "list" para obtener la lista de templates
      ListTemplates(): void {
      this.tempService.list().subscribe((result) =>{
  
        this.question_templates.data = result;
        this.question_templates.sort = this.sort;
        this.question_templates.paginator = this.paginator;
 
      } );
      }
        /********************************************************************************************************* */
     //Uso del método "list_status" para obtener los estados de evaluación
     ListStatus(){
      this.tempService.list_status().subscribe((data)=>{
       this.template_status = data;
       console.log(this.template_status)
     });
    }

     /********************************************************************************************************* */
     //Uso del método "list_status" para obtener los estados de evaluación
     ListCriteriaGroups(){
      this.critGroupService.list().subscribe((data)=>{
       this.crit_groups = data;
       console.log(this.crit_groups)
     });
    }
 /********************************************************************************************************* */
      //metodo que consume el servicio question_templates.service para agregar una nueva Plantilla
 insert() {
//habilitamos el boton para crear en la modal
this.method =1;

  //Ejecución del metodo create para registrar Plantilla  
 this.tempService.create(this.form.value).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('Plantilla registrada con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista 
this.ListTemplates();

}else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar la plantilla', 'Error!');
}
});
}
 /********************************************************************************************************* */

 //Método que carga los datos del Plantilla seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.tempService.select(code).subscribe(data=>{
    this.form.setValue({
      id: data[0].id,
      type:data[0].type,
      description:data[0].description,
      status:data[0].status,
      group:data[0].group
    });
  });
 }


 /********************************************************************************************************* */
//Se utiliza el metodo "update" del question_templates.service para realizar el PUT en la API 
   update(){          

this.tempService.update(this.form.value).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('Plantilla actualizada con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;

//Recargamos la lista de Plantillas
this.ListTemplates();

 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
   }

 /********************************************************************************************************* */
  //método que consume el método "delete" en el question_templates.service para eliminar al usuario seleccionado
      delete(code) {
        
  //uso de sweetalert2 para validar el proceso 
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar esta plantilla,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(code)
            this.tempService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'La plantilla ha sido eliminada',
                  'success'
                )
              this.ListTemplates();
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
        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.question_templates.filter = filterValue;
      }
 /********************************************************************************************************* */
      manageItems(code){
              this.localService.setSelectedId(code);
      }

}
