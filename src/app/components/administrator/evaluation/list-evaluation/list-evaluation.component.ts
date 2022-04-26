import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EvaluationsService } from 'src/app/services/evaluations.service';
import { EvaluatorsService } from 'src/app/services/evaluators.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.css']
})
export class ListEvaluationComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */
//Variable que almacena el tipo de evaluación a listar pasado desde la URL
Route_type="";
evaluation_type=0; // será 1 si es 360° y 2 si es auto-evaluación

//Variable que será true si no se ha seleccionado evaluation o auto-evaluation para listar
error_container=false;

 //Columnas de la tabla
 displayedColumns = ['#','Título','Inicio/Fin','Estado','Acción'];

 //para carga de pantalla
 public load: boolean;

  //arreglo de tipo Mat-table para listar evaluaciones
  evaluations = new MatTableDataSource();

  //Carga de estados para evaluacion
  evaluation_status=null;

  //objeto que almacena los datos de la evaluación para insertarlos en la tabla (Evaluations)
evaluationData = {
  id: 0,
  title: "",
  description: "",
  start_date: null,
  end_date:null,
  status:null,
  id_template:null
  }

  form: FormGroup;


/********************************************************************************************************* */
  constructor(public authService: AuthService, public evaluationService: EvaluationsService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public evaluatorService:EvaluatorsService,private route: ActivatedRoute,
    public formBuilder:FormBuilder) { 
       //Construllendo formulario
    this.buildForm();
    }
/********************************************************************************************************* */
   //Formulario
   buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required,Validators.maxLength(100)]],
      description: ['', []],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }
 
  get id(){return this.form.get('id');}
  get title(){return this.form.get('title');}
  get description(){return this.form.get('description');}
  get start_date(){return this.form.get('start_date');}
  get end_date(){return this.form.get('end_date');}
  get status(){return this.form.get('status');}
  get type(){return this.form.get('type');}

      ngOnInit(): void {
        this.load=false;
        //Al cargar la componente obtenemos el tipo de evaluaciones a listar desde la URL
        this.Route_type= this.route.snapshot.paramMap.get('type');
        if(this.Route_type=='evaluations'){
          //Activación de método para lista de evaluaciones
          this.evaluation_type=1;
          this.ListEvaluations();
        }else if(this.Route_type=='auto-evaluations'){
            //Activación de método para lista de auto-evaluaciones
            this.evaluation_type=2;
            this.ListEvaluations();
        }else{
          //Activamos mensaje de error si en la ruta no se ha especificado el tipo de evaluación a listar
          this.load = true;
          this.error_container=true;
        }
        console.log(this.error_container)
    
    //Activación de método para lista de estados de evaluación
    this.ListStatus();
        
      }
  /********************************************************************************************************* */
      //Uso del método "list" para obtener la lista de evaluaciones/autoevluaciones
    ListEvaluations() {
          //validando el tipo de usuario para ejecutar la lista de evaluaciones
          if(this.user.id_user_category==1){ //Los administradores pueden listarlas todas
            //invocando método para lista de todas las evaluaciones/autoevaluaciones
            this.evaluationService.list(this.evaluation_type).subscribe((result) =>{
              this.evaluations.data = result;
              this.evaluations.sort = this.sort;
              this.evaluations.paginator = this.paginator;
              
            });
          
          }else if(this.user.id_user_category==2||this.user.id_user_category==3){//Para los demás usuarios
          //invocando método para lista de evaluaciones según el usuario
          this.evaluatorService.evaluations_by_user(parseInt(this.user.id_usr),this.evaluation_type).subscribe((result) =>{
            this.evaluations.data = result;
            this.evaluations.sort = this.sort;
            this.evaluations.paginator = this.paginator;
          });
          }

          setTimeout(() => {
            this.load=true;
          }, 3000);
         
      }


/********************************************************************************************************* */
  ListStatus(){
    this.evaluationService.list_status().subscribe(data=>{
      this.evaluation_status=data;
    })
  }
  
  /********************************************************************************************************* */

 //Método que carga los datos de la evaluación seleccionada en el modalForm
 select(code){      
    this.evaluationService.select(code).subscribe(data=>{
      //Corrección del formato de fechas para cargarlas en el formulario
      //usando moment.js
      let correctSdate = moment(data[0].start_date).format("YYYY-MM-DDTHH:mm"); 
      let correctEdate = moment(data[0].end_date).format("YYYY-MM-DDTHH:mm");
    //Asignando parametros al formulario con fechas corregidas  
      this.form.setValue({
        id: data[0].id,
        title:data[0].title,
        description: data[0].description,
        start_date: correctSdate,
        end_date:  correctEdate,
        type: data[0].type,
        status: data[0].status
      });
    });
   }
  
   /********************************************************************************************************* */
  
  //Se utiliza el metodo "update" del employments.service para realizar el PUT en la API 
     update(){          
  //Obteniendo almacenando objeto con datos del formulario para extraer el id

  this.evaluationService.update(this.form.value).subscribe(data => {    
   if (data['result'] == 'OK') {
     this.toastr.success('Evaluación actualizada con exito', 'Perfecto!');
   
    //Limpieza del formulario
  this.clearForm();
  
  //Recargamos la lista de departamentos
  this.ListEvaluations();
  
   }else if(data['result'] == 'ERROR'){
     this.toastr.error('No se ha podido resolver la petición', 'Error!');
   }
  
   });
     }

     /********************************************************************************************************* */
  //método que consume el método "delete" en el evaluations.service para eliminar al usuario seleccionado
  delete(code) {
    //uso de sweetalert2 para validar el proceso 
          Swal.fire({
            title: '¡ALERTA!',
            text: "Esta a punto de eliminar esta evaluación,  ¿Desea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.evaluationService.delete(code).subscribe(data => {
                if (data['result'] == 'OK') {
                  Swal.fire(
                    'Eliminado!',
                    'La evaluación ha sido eliminada',
                    'success'
                  )
                this.ListEvaluations();
                }else if (data['result'] == 'ERROR'){
                  Swal.fire(
                    'Error!',
                    'La evaluación no ha sido eliminada',
                    'error'
                  )
                }
                });
              
            }
          })
  
          }
  /********************************************************************************************************* */
   //Limpieza de formulario
     clearForm(){
    this.evaluationData = {
      id: 0,
      title: "",
      description: "",
      start_date:null,
      end_date:null,
      status:null,
      id_template:null
      }
  }

  /********************************************************************************************************* */
         //Buscador
         applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.evaluations.filter = filterValue;
      }

  /********************************************************************************************************* */
         //Uso del localstorage service para "almacenar" el id y nombre de la evaluación seleccionada
         //la cual será consumida desde la componente list-evaluators
         list_evaluators(id: number,title:string) {
           let evaluationData={
             id: id,
             title: title
           }
          this.localService.setEvaluationdId(evaluationData);
      }
   /********************************************************************************************************* */
         //Uso del localstorage service para "almacenar" el id de la evaluación seleccionada
         //la cual será consumida desde la componente evaluating
         evaluating(id: number) {
         this.localService.setEvadId(id);
     }

}


