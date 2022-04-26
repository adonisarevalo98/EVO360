import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RatingTypesService {
  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_ratings_types;
key = this.resourceService.Key;
//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
//Lista de evaluadores
list() {
  return this.http.get(this.url+this.key,{headers: this.headers});
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
}
