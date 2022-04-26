import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ItemsService } from 'src/app/services/items.service';
import { RatingsService } from 'src/app/services/ratings.service';
import { CriteriaService } from 'src/app/services/criteria.service';
import { RatingTypesService } from 'src/app/services/rating-types.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { QuestionTemplatesService } from 'src/app/services/question-templates.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

   //Cargando propiedades de material (Paginator y sort) del Mat-table
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;

  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */
  
 //Variable que almacena el id pasado desde la URL
 Route_id=0;

 //Variable que almacen el nombre de la plantilla seleccionada
 template_name;
 //Variable que almacena el grupo de criterios que esta asignado al template
 criteria_group=0;

 //Columnas de la tabla
 displayedColumns = ['#', 'Pregunta','Tipo', 'Criterio', 'Acción'];

  //arreglo para listar items según la item seleccionada
  items = new MatTableDataSource();

 //cargando tipos de pregunta
  question_types= this.itemService.question_types;

  //arreglo para listar criterios de evaluación
  criteria;

   //arreglo para listar tipos de puntuación
   ratings_types;

  //objeto que almacena los datos del item para crear/modificar en la bdd
  itemData={
    id:0,
    question:"",
    question_origin:0,
    question_type:1,
    comment:"",
    id_template: this.Route_id,
    id_rating_type:1,
    id_criterion:null
  };

  //Variable que será 1 si el formulario modal será para crear y 2 si será para actualizar
  method=1; 

   //variable que almacena lo digitado en el buscador 
   text: string;

/********************************************************************************************************* */
  constructor(public authService: AuthService, public itemService: ItemsService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public ratingService: RatingsService, private route: ActivatedRoute,
    public criteriaService: CriteriaService, public templateService: QuestionTemplatesService,
    public ratypeService:RatingTypesService) { }

    
      ngOnInit(): void {
       
        //Al cargar la componente obtenemos el id desde la URL
        this.Route_id= parseInt(this.route.snapshot.paramMap.get('id'));
    
        //Consultamos el nombre de la plantilla seleccionada
        this.templateService.select(this.Route_id).subscribe(data=>{
          this.template_name = data[0].type;
          this.criteria_group = data[0].group;
        });

        //invocando método para lista de items
        this.Listitems(this.Route_id);

        //invocando método para lista de criterios
        this.Listcriteria();

        //invocando método para lista de sistemas de puntuación
        this.ListRatingTypes();
      }


      //Uso del método "list" para obtener la lista de items segun el id del template
      Listitems(id): void {
      this.itemService.list_by_template(id).subscribe((result) =>{
        
        this.items.data = result
        this.items.sort = this.sort;
        this.items.paginator = this.paginator;
 
      } );
      }

      //Uso del método "list" para obtener la lista de criterios de evaluación
      Listcriteria(): void {
        this.criteriaService.criteria_by_group(this.criteria_group).subscribe((result) =>{
          this.criteria = result;
   
        } );
        }

        
      //Uso del método "list" para obtener la lista de sistemas de puntuación
      ListRatingTypes(): void {
        this.ratypeService.list().subscribe((result) =>{
          this.ratings_types = result;
          console.log(this.ratings_types)
        } );
        }


      //metodo que consume el servicio items.service para agregar un nuevo item
 insert() {
//habilitamos el boton para crear en la modal
this.method =1;
console.log(this.itemData)
  //Ejecución del metodo create para registrar item  
 this.itemService.create(this.itemData).subscribe(data => {

if (data['result'] == 'OK') {
 this.toastr.success('item registrado con éxito', 'Perfecto!');

//Limpieza del formulario
this.clearForm();

//recargamos la lista 
this.Listitems(this.Route_id);

}else if (data['result'] == 'ERROR'){
 this.toastr.error('No se pudo registrar el item', 'Error!');
 console.log(data)
}
});
}


 //Método que carga los datos del item seleccionado en el formulario
 select(code){     
//habilitamos el boton para actualizar en la modal
this.method =2;

  this.itemService.select(code).subscribe(data=>{
    this.itemData = data[0];
  });
 }


//Se utiliza el metodo "update" del items.service para realizar el PUT en la API 
   update(){          

this.itemService.update(this.itemData).subscribe(data => {    
 if (data['result'] == 'OK') {
   this.toastr.success('item actualizada con exito', 'Perfecto!');
 
  //Limpieza del formulario
this.clearForm();

//deshabilitamos el boton de actualización y habilitamos el de crear en la modal
this.method =1;

//Recargamos la lista de items
this.Listitems(this.Route_id);

 }else if(data['result'] == 'ERROR'){
   this.toastr.error('No se ha podido resolver la petición', 'Error!');
 }

 });
   }


  //método que consume el método "delete" en el items.service para eliminar al usuario seleccionado
      delete(code) {
  //uso de sweetalert2 para validar el proceso 
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar este item,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.itemService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'El item ha sido eliminado',
                  'success'
                )
              this.Listitems(this.Route_id);
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
        

        //Método para limpiar formulario (antes de hacer un create y luego de hacer un update)
        clearForm(){
          //reseteamos el boton de la modal para mantener al metodo insert por defecto
          this.method=1;
          this.itemData={
            id:0,
            question:"",
            question_origin:0,
            question_type:1,
            comment:"",
            id_template: this.Route_id,
            id_rating_type:1,
            id_criterion:null
          };
        }

        applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.items.filter = filterValue;
      }



}
