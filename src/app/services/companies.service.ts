import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
//Lista de estados
company_status;

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_companies;
url_status = this.resourceService.baseUrl_companyStatus;
key = this.resourceService.Key;
//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

//Lista de status
list_status() {
   return this.http.get<any>(this.url_status+this.key,{headers: this.headers});
}  

//Lista de Empresas
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear Empresas
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar Empresas
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de una empresa segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar Empresas
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}
}
