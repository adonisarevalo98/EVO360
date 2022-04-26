import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CriteriaService {

    constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  
    //obteniendo la URL base de la API en Laravel y la llave del middleware
  url = this.resourceService.baseUrl_criteria;
  key = this.resourceService.Key;

  //Url para lista de criterios que pertenecen a un grupo de criterios
  url_by_group = this.resourceService.baseUrl_criteria_by_group;
  
  //cabeceras
  headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization','Bearer '+localStorage.getItem('token'));
  
    
  //Lista de criterios que pertenecen a un grupo de criterios
  criteria_by_group(id:number) {
    return this.http.get<any>(this.url_by_group+id+this.key,{headers: this.headers});
  }
  
  //Crear criterios
  create(data) { 
      return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
  }
  
  //eliminar criterios
  delete(id: number) {
    return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
  }
  
  //obtener los datos de un usuario segun su id
  select(id: number) {
    return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
  }
  
  //editar criterios
  update(data) {
    return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
  }
}
