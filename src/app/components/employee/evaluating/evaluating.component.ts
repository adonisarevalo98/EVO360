import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { RatingsService } from 'src/app/services/ratings.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluatorsService } from 'src/app/services/evaluators.service';
import { CriteriaService } from 'src/app/services/criteria.service';
import { ScoresService } from 'src/app/services/scores.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-evaluating',
  templateUrl: './evaluating.component.html',
  styleUrls: ['./evaluating.component.css']
})
export class EvaluatingComponent implements OnInit {
/****************************************** VARIABLES LOCALES **************************************** */
user=this.authService.getuserSession();

//Variable que almacena el id de la evaluación seleccionada
id_evaluation;

 //Columnas de la tabla
 displayedColumns = ['index', 'Items','Opciones'];

  //para carga de pantalla
  public load: boolean;

  //para carga de pantalla de denegación (0=desactivada, 1= autoevaluación, 2=no posee level)
  public load_denied=0;

  //Arreglo que almacena los items, ratings, criterios y grupo de criterio de la evaluación
  public evaluation;

  //Variable que almacena el grupo de criterios al que pertenecen los items
  criteria_group=0;

  //Objeto que almacena los ratings seleccionados
  selectedRatings;

  //Arreglo que almacena los id de los criterios de evaluación de cada item
  id_criteria=[]; 

  //Arreglo que almacena los id de los items asignados a la evaluación (id de evaluations_items)
  id_evaitem=[]

  //Arreglo que almacena los criterios de evaluación para seccionar los items de la tabla
  criteria=[];

  //Objeto que almacena los datos del evaluador (para validar sus permisos de realización)
  evaluatorData;

   //Objeto que almacena los datos del evaluado
   evaluatedData={
     name:"",
     last_name:"",
     id_user:null
   };

  //Objeto que almacena los resultados de la evaluación para almacenar en la tabla Scores
  scoreData={
    id_evaluator:null,
    scores:{},
  }

   //Formulario
 form: FormGroup;

  /*********************************************************************************************** */

  constructor(public itemService: ItemsService, public ratingService:RatingsService,
   public localService: LocalstorageService, public criteriaService: CriteriaService,
   public authService:AuthService,public toastr: ToastrService,
   public evaluatorService:EvaluatorsService, public scoreService:ScoresService ) {

   //Construllendo formulario
   this.buildForm();

 }
 /********************************************************************************************************* */
   //Construcción del formulario
   buildForm() {
    this.form= new FormGroup({});
    }
/********************************************************************************************************* */
  ngOnInit(): void {
    //Activamos el spinner para carga de datos
    this.load=false;
    //Obteniendo id de la evaluación seleccionada
   this.id_evaluation = this.localService.getEvaId();
   if(this.id_evaluation!=null){
      //Activacion del método para obtener credenciales de evaluador del usuario actual
      this.getEvaluator();
   //Activación de metodo para validar si el usuario actual tiene permiso de realizar la evaluación
   this.validateAction();
    
   }
  }
  /********************************************************************************************************* */
  //Método para validar permisos de realizacón
   validateAction(){
     this.evaluatorService.evaluated_of_evaluation(this.id_evaluation).subscribe(data=>{
       this.evaluatedData=data[0];
       //Si el usuario es el evaluado de la evaluación se le deniega el permiso
            if ((this.user.id_usr == data[0].id_user)||(this.evaluatorData.level==3)){
            this.load_denied=1;
           
          }else{
            //Activación de método para lista de ratings por cada item de la evaluación
            this.listRatings();
          }
     });
   }
  /********************************************************************************************************* */
  //Método con el que se obtienen las credenciales del usuario que realizará la evaluación
getEvaluator(){
  this.evaluatorService.evaluator_of_evaluation(this.user.id_usr,this.id_evaluation).subscribe(data=>{
    this.evaluatorData=data[0];
    console.log(this.evaluatorData)
  })
}

/********************************************************************************************************* */
//Método que obtiene la lista de items con su criteria y ratings
  listRatings(){
    this.ratingService.ratings_by_evaluation(this.id_evaluation).subscribe(data=>{
          this.evaluation = data; //Almacenamos los items, sus ratings, criterios y grupo de criterios
          this.criteria_group = data[0].criteria_group; //Extraemos en una variable el grupo de criterios de un solo item
                                               //Ya que todos los items pertenecen el mismo grupo de criterios

          this.evaluation.forEach(element => {//Recorremos la lista de items y almacenamos los
                                              //id de sus criterios de evaluación
            this.id_criteria.push(element.id_criterion); 
             //almacenamos los id de los evaluations_items pasados a string para cargarlos en cada formControl del html 
             this.id_evaitem.push(element.id_evaitem.toString());
            //Creamos un validador con el nombre del item para cada mat-radio-group de ese item
            this.form.addControl(element.id_evaitem.toString(), new FormControl('', Validators.required));
          });
         //Una vez traidos los items y sus ratings  
        //Activamos el método para lista de criterios de evaluación
         this.listCriteria();
    });
  }
/********************************************************************************************************* */
//Método que obtiene todos los criterios de evaluación existentes y almacena unicamente a los que 
//coincidan con los items de la evaluación
  listCriteria(){
    this.criteriaService.criteria_by_group(this.criteria_group).subscribe(data=>{
      data.forEach(element => { //Recorremos la lista de criterios
        if(this.id_criteria.includes(element.id)){ //si el id de un criterio existe en la lista de items
             this.criteria.push(element);             //Almacenamos el criterio para mostrarlo en la tabla
        }
      });
      console.log(this.criteria)
      setTimeout(() => {
        this.load=true;
      }, 3000);
    });
  }

  /********************************************************************************************************* */
  //Método para almacenar los resultados de la evaluación

  create(){
    this.form.markAllAsTouched();
    if( this.evaluation.length==0){ //Validamos si la evaluación tiene items
      this.toastr.error('No se puede efectuar esta evaluación', 'Error!'); //Si no tiene items no se puede almacenar
    }else if(this.form.valid ){
      this.scoreData={
        id_evaluator:this.evaluatorData.id,
        scores:this.form.value
      }
      console.log(this.scoreData)
    this.scoreService.create(this.scoreData).subscribe(data=>{
           console.log(data)
    })
    }else{
      this.toastr.error('Debe completar la evaluación', 'Error!');
    }
   
  }

}
