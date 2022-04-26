import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CriteriaGroupsService {

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_criteria_groups;
key = this.resourceService.Key;
url_algorithm = this.resourceService.baseUrl_algorithms;

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
//Lista de algoritmos de cálculo
algorithm_list() {
  return this.http.get<any>(this.url_algorithm+this.key,{headers: this.headers});
}

//Lista de grupos de criterios
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear grupos de criterios
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar grupos de criterios
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de grupos de criterios segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar grupos de criterios
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}
}
