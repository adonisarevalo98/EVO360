import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmploymentsService {

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_employments;
key = this.resourceService.Key;

//lista de cargos por empresa
url_by_company = this.resourceService.baserUrl_employments_by_company
//lista de cargos por departamento
url_by_department = this.resourceService.baserUrl_employments_by_department

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
//Lista de cargos
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear cargos
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar cargos
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar cargos
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}

//Lista de cargos por empresa
list_by_company(id:number) {
  return this.http.get<any>(this.url_by_company+id+this.key,{headers: this.headers});
}

//Lista de cargos por departamento
list_by_department(id:number) {
  return this.http.get<any>(this.url_by_department+id+this.key,{headers: this.headers});
}

}
