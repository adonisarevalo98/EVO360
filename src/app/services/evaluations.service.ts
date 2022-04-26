import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {
//Objeto que almacena los unicos estados de evaluación disponibles
status=[
  { id:1,
    status:"Activado"
  },
  { 
    id:2,
    status:"Desactivado"
  }
];

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_evaluations;
url_status = this.resourceService.baseUrl_evaluationStatus;
key = this.resourceService.Key;

//Url para lista de evaluaciones según el tipo
url_list_evaluation = this.resourceService.baseUrl_list_evaluations;
//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  //Lista de status
list_status() {
  return this.http.get<any>(this.url_status+this.key,{headers: this.headers});
} 

//Lista de evaluaciones
list(type:number) {
  return this.http.get<any>(this.url_list_evaluation+type+this.key,{headers: this.headers});
}

//Crear evaluaciones
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar evaluaciones
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar evaluaciones
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}
}
