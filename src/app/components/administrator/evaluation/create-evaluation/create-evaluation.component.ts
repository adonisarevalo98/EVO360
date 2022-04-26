import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "src/app/services/auth.service";
import { EvaluationsService } from 'src/app/services/evaluations.service';
import { QuestionTemplatesService } from 'src/app/services/question-templates.service';
import { DepartmentsService } from 'src/app/services/departments.service';
import { UsersService } from 'src/app/services/users.service';
import { ItemsService } from 'src/app/services/items.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { EvaluatorsService } from 'src/app/services/evaluators.service';
import { EvaluationsItemsService } from 'src/app/services/evaluations-items.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.component.html',
  styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
/****************************************** VARIABLES LOCALES **************************************** */

public user = this.authService.getuserSession();

//para carga de pantalla
public load: boolean;

//Variable que almacena el tipo de evaluación que se va a crear (extraida desde el enlace) 
Route_type = "";
evaluation_type=0; // será 1 si es 360° y 2 si es auto-evaluación

//cargando status para evaluación
evaluation_status;

//objeto que almacena los datos de la evaluación para insertarlos en la tabla (Evaluations)
evaluationData = {
id: 0,
title: "",
description: "",
start_date: "",
end_date:"",
status:null,
id_template:0
}

//Arreglo que almacena los templates en estado activo
question_templates;

//Columnas de la tabla
displayedColumns = ['#', 'Pregunta','Tipo', 'Criterio'];

//arreglo para listar items según la item seleccionada
items = new MatTableDataSource();

//Arreglo que almacena la lista de empresas disponibles
companies:any;

//Variables que almacenan el id y nombre de la empresa seleccionada
id_company;

//Arreglo que almacena la lista de departamentos disponibles
departments:any;

// Variable que almacena el id del departamento seleccionado 
department_id = '';

//Arreglo que almacena la lista de usuarios según el departamento seleccionado
users:any;

//Variable que almacena el nombre del usuario que será evaluado
evaluated_name;

//objeto que almacena los datos del creador y 
//el usuario asignado para guardar en tabla "Evaluators" 
evaluatorData = {
  id: 0,
  id_evaluation: null,
  user: {
    //Evaluado
    user:{
      id:null,
      level:3,
      status:null
    },
    //Creador de la evaluación
    creator:{
      id:null,
      level:1,
      status:2
    } 
  },
  
  }

  //objeto que almacena los items a guardar en la tabla "Evaluations-Items" 
evaItemsData = {
  id: 0,
  id_evaluation: null,
  items: null
  }
  


/********************************************************************************************************* */
form: FormGroup;

constructor(public authService: AuthService, public evaluaService:EvaluationsService,
  public toastr: ToastrService, public tempService: QuestionTemplatesService,
  public itemService:ItemsService, public departmentService: DepartmentsService,
  public userService:UsersService, public companyService:CompaniesService,
  public evaluatorService:EvaluatorsService, public evaItemService:EvaluationsItemsService,
  public formBuilder:FormBuilder,private route: ActivatedRoute) {
    //Construllendo formulario
    this.buildForm();
   }
/********************************************************************************************************* */
   //Formulario
   buildForm() {
    this.form = this.formBuilder.group({
      title: ['', []],
      description: ['', [Validators.maxLength(100)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      type: [2, [Validators.required]],
      template: ['', [Validators.required]],
      company: ['', [Validators.required]],
      department: ['', [Validators.required]],
      id_user: ['null', [Validators.required]],
    });
  }
  get title(){return this.form.get('title');}
  get description(){return this.form.get('description');}
  get start_date(){return this.form.get('start_date');}
  get end_date(){return this.form.get('end_date');}
  get status(){return this.form.get('status');}
  get type(){return this.form.get('type');}
  get template(){return this.form.get('template');}
  get company(){return this.form.get('company');}
  get department(){return this.form.get('department');}
  get id_user(){return this.form.get('id_user');}
 
  ngOnInit(){
    //Habilitamos la visualización del formulario
    this.load = true;
     //Al cargar la componente obtenemos el tipo de evaluaciones a crear desde la URL
     this.Route_type = this.route.snapshot.paramMap.get('type');
     if(this.Route_type=='evaluations'){  
       this.evaluation_type=1;
     }else if(this.Route_type=='auto-evaluations'){
       this.evaluation_type=2;
     }
    //LLamada al método para lista de plantillas
    this.List_templates();
     //LLamada al método para lista de empresas
     this.ListCompanies();
     //Llamada al método para lista de estados de evaluación
    this.ListStatus();
   }

  /********************************************************************************************************* */
  //Método para obtener lista de plantillas
  List_templates(){
    this.tempService.list_active_temps().subscribe(data=>{
    this.question_templates = data;
    });
  }
  /********************************************************************************************************* */
     //Uso del método "list" para obtener la lista de empresas 
     ListCompanies(): void {
      this.companyService.list().subscribe((result) =>{
        //El usuario administrador obtiene la lista de todas las empresas
        if(this.user.id_user_category==1){
          this.companies=result;
        }else if(this.user.id_user_category==2){ //El usuario gestor solo tiene acceso a su empresa
                result.forEach(element => { //recorremos la lista de empresas
                        if(element.id==this.user.id_company){ //Comparamos la empresa del usuario en el array
                        this.companies = [//Si coincide una empresa solo listamos esa empresa
                          { id: element.id, company: element.company }];
                          }
                    });
        }
      } );
   
     
      }
  /********************************************************************************************************* */
      //Uso del método "list_status" para obtener los estados de evaluación
      ListStatus(){
        this.evaluaService.list_status().subscribe((data)=>{
         this.evaluation_status = data;
       });
      }
  /********************************************************************************************************* */
  //Método para obtener lista de departamentos según la empresa seleccionada
  List_Departments(id){
    if((id!=null)&&(id!="")){
    this.departmentService.list_by_company(id).subscribe(data=>{
    this.departments = data;
    });
  }
  }
  /********************************************************************************************************* */
  //Método para obtener lista de usuarios según el departamento seleccionado
  List_Users(id){
    if((id!=null)&&(id!="")){
    this.userService.users_by_department(id).subscribe(data=>{
    this.users = data;
    });
  }
  }

  /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar una empresa del select (Para listar departamentos)
      CompselectChangeHandler(event:any){
        //limpiamos los departamentos y al usuario seleccionado tras cambiar de empresa
        this.department_id=null;
        this.form.value.id_user=null;
        this.departments=null;
        this.users=null;
        this.evaluated_name="";

        //Guardamos el id de la empresa seleccionada
        this.id_company = event.target.value;
           
        //Activamos el método para lista de cargos por empresa
        this.List_Departments(this.id_company);
      }

        /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar un departamento del select (Para listar cargos)
      DepselectChangeHandler(event:any){
        //limpiamos al usuario seleccionado tras cambiar de departamento
        this.form.value.id_user=null;
        this.users=null;
      
        //Guardamos el id del departamento seleccionado
        this.department_id = event.target.value;
        this.List_Users(this.department_id);
      
      }
    /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar una plantilla
      TempselectChangeHandler(event:any){
        //limpiamos las plantilla importada previamente
        this.evaluationData.id_template=event.target.value;
        this.evaItemsData.items=null;
      }  
       /********************************************************************************************************* */
      //Metodo que se ejecuta al seleccionar al empleado que será evaluado
      UserselectChangeHandler(event:any){
        //recorremos la lista de empleados y capturamos el nombre del empleado seleccionado
        if(event.target.value!=null&&event.target.value!=""){
        this.users.forEach(element => {
          if(element.id==event.target.value){
            this.evaluated_name=element.name+" "+element.last_name;
          }
        });
      }
      }  


/********************************************************************************************************* */
ConfirmInsert(){
  this.form.markAllAsTouched();
  if(this.form.valid){
   //Validamos que una plantilla halla sido importada
   if(this.evaItemsData.items!=null){
  //uso de sweetalert2 para validar el proceso 
  Swal.fire({
    title: '¡Atención!',
    text: "Una vez creada la evaluación no se podrá cambiar al evaluado ni los items importados,  ¿Desea continuar?",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     this.insert();
      
    }
  });
}else{//Si no se ha importado una plantilla
  this.toastr.error('No se ha importado una plantilla', 'Error!');
}
}
}
//metodo que consume el servicio evaluations para agregar una nueva evaluacion
insert() {
      //Desplegamos el spinner de carga de datos
      this.load=false;
      //Asignamos título unico a la evaluación y el tipo de evaluación definida segun la url
      var date = Date.now();
      this.form.patchValue({
        title:date+"-"+this.evaluated_name, 
        type:this.evaluation_type
      });
      //En caso de crear una autoveluacion, el evaluado será el que efectúe esa evaluacion
      //por lo que el proceso se coloca como "No iniciado"
      console.log(this.evaluation_type)
      if(this.evaluation_type==2){
        this.evaluatorData.user.user.status=2;
      }
      //Ejecución del metodo create para registrar evaluación  
      this.evaluaService.create(this.form.value).subscribe(data => {
        //Si se logró crear la evaluación
    if (data['result'] == 'OK') {//*****************************************************

      //Guardamos el id de la evaluación recién creada (obtenida desde la API)
      this.evaluatorData.id_evaluation=data['id_evaluation']; //Tabla Evaluators
      this.evaItemsData.id_evaluation=data['id_evaluation']; //Tabla Evaluations-Items
      //Guardamos el id del usuario actual (creador de la evaluación)
      this.evaluatorData.user.creator.id=this.user.id_usr;
      //Guardamos el id del usuario evaluado (desde el select)
      this.evaluatorData.user.user.id = this.form.value.id_user;
      
      //Ejecución del método create para registrar al evaluado
      this.evaluatorService.create(this.evaluatorData).subscribe(data1=>{
        console.log(data)
              //Si se logró asignar al creador y al evaluado
              if (data1['result'] == 'OK'){//*****************************************************
                      //Ejecución del método create para registrar los items de la evaluación
                      this.evaItemService.create(this.evaItemsData).subscribe(data2=>{
                        //Si se logró asignar los items a la evaluación
                      if(data2['result']=='OK'){//*****************************************************
                        //Timmer para espera de carga de datos
                          setTimeout(() => {
                            this.toastr.success('Evaluación registrada con éxito', 'Perfecto!');
                            //habilitamos vista de formulario
                            this.load = true;
                      
                          }, 3000);
                        
                            //Si hubo un error en la asignación de items
                      }else if(data2['result']=='ERROR'){
                        console.log(data2)
                                //Eliminamos la evaluación.
                                this.deleteEvaluation();     
                        }
                    });
              //Si hubo un error en la asignación del creador y el evaluado
              }else if (data1['result'] == 'ERROR'){
                //Eliminamos la evaluación.
                console.log(data1)
                this.deleteEvaluation();            
              }
      });
    }else if (data['result'] == 'ERROR'){
      this.toastr.error('No se pudo resolver la petición', 'Error!');
      //habilitamos vista de formulario
      this.load = true;
    }else if (data['result'] == 'NO'){
      this.toastr.error('El título de evaluación ya está en uso', 'Error!');
      //habilitamos vista de formulario
      this.load = true;
    }else if (data['result'] == 'INCORRECT'){
      this.toastr.error(data['response'], 'Error!');
      //habilitamos vista de formulario
      this.load = true;
    }
    });
}
/********************************************************************************************************* */
//Método para eliminar una evaluación en caso de que no haya podido ser asignada en evaluators o items
deleteEvaluation(){
  this.evaluaService.delete(this.evaluatorData.id_evaluation).subscribe(data3=>{
    if(data3['result']=='OK'){
    this.toastr.error('No se pudo crear la evaluación', 'Error!');
  //habilitamos vista de formulario
  this.load = true;
    }else if(data3['result']=='ERROR'){
    this.toastr.error('Fallo en la operación', 'Error 500!');
      }
      });
}
/********************************************************************************************************* */
  //Uso del método "list" para obtener la lista de items segun el id del template
  Importitems(id): void {
    console.log(id)
    this.itemService.list_by_template(id).subscribe((result) =>{
       //cargamos en un arreglo de tipo Mat-table la lista de items segun la plantilla
       //seleccionada
      this.items.data = result;
      this.items.sort = this.sort;
      this.items.paginator = this.paginator;
      //Cargamos en el objeto a insertar dentro de la tabla Evaluations-Items
      this.evaItemsData.items=result;

      
    } );
    }
/********************************************************************************************************* */
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.items.filter = filterValue;
  }

}
