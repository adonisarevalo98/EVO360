import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class QuestionTemplatesService {


  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_quests_temps;
url_status = this.resourceService.baseUrl_templateStatus;
key = this.resourceService.Key;

//Url para lista de plantillas en estado activo
url_list_active_temps= this.resourceService.baseUrl_list_active_temps;

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

     //Lista de status
list_status() {
 return this.http.get<any>(this.url_status+this.key,{headers: this.headers});
} 

//Lista de departamentos
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear departamentos
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar departamentos
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar departamentos
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}

list_active_temps(){
  return this.http.get<any>(this.url_list_active_temps+this.key,{headers: this.headers});
}
}
