import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EvaluatorsService {

  
  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_evaluators;
url_level = this.resourceService.baseUrl_evaluatorLevel;
url_status= this.resourceService.baseUrl_evaluatorStatus;
key = this.resourceService.Key;
//url para lista de evaluaciones por usuario
url_evaluations_by_user = this.resourceService.baseUrl_evaluations_by_user;
//url para lista de evaluadores por evaluación
url_evaluators_by_evaluation = this.resourceService.baseUrl_evaluators_by_evaluation;
//url para obtener la empresa a la que pertenece un evaluado
url_companies_by_evaluated = this.resourceService.baseUrl_companies_by_evaluated;
//url para obtener el id del evaluado de una evaluación
url_evaluated_of_evaluation = this.resourceService.baseUrl_evaluated_of_evaluation;
//url para obtener el id de evaluador de un usuario
url_evaluator_of_evaluation = this.resourceService.baseUrl_evaluator_of_evaluation


//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

   //Lista de niveles de evaluador
list_levels() {
 return this.http.get<any>(this.url_level+this.key,{headers: this.headers});
} 
//Lista de status de evaluador
list_status() {
  return this.http.get<any>(this.url_status+this.key,{headers: this.headers});
 } 
  
//Lista de evaluadores
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear evaluadores
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar evaluadores
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar evaluadores
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}

//lista de evaluaciones según el id del evaluador o evaluado 
evaluations_by_user(id:number,type:number) {
  return this.http.get<any>(this.url_evaluations_by_user+id+'/'+type+this.key,{headers: this.headers});
}

//lista de evaluadores de una evaluación
evaluators_by_evaluation(id_user:number,id_evaluation:number) {
  return this.http.get<any>(this.url_evaluators_by_evaluation+id_user+'/'+id_evaluation+this.key,{headers: this.headers});
}

//obtener id y nombre de empresa a la que pertenece el evaluado de una evaluación
companies_by_evaluated(id:number) {
  return this.http.get<any>(this.url_companies_by_evaluated+id+this.key,{headers: this.headers});
}
//obtener id del usuario evaluado de una evaluación
evaluated_of_evaluation(id:number) {
  return this.http.get<any>(this.url_evaluated_of_evaluation+id+this.key,{headers: this.headers});
}

//obtener id y nombre de empresa a la que pertenece el evaluado de una evaluación
evaluator_of_evaluation(id_user:number,id_evaluation:number) {
  return this.http.get<any>(this.url_evaluator_of_evaluation+id_user+'/'+id_evaluation+this.key,{headers: this.headers});
}

}
