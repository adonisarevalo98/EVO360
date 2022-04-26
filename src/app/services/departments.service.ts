import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Department } from '../models/department';
@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_departments;
key = this.resourceService.Key;

//lista de departamentos por empresa
url_by_company = this.resourceService.baserUrl_departments_by_company

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
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
//Lista de departamentos por empresa
list_by_company(id:number) {
  return this.http.get<any>(this.url_by_company+id+this.key,{headers: this.headers});
}
}
