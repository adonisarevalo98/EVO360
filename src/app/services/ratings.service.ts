import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RatingsService {

//url para obtener el id del creador y evaluado de una evaluación
url_ratings_by_evaluation = this.resourceService.baseUrl_ratings_by_evaluation;

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }

  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_ratings;
key = this.resourceService.Key;

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
//Lista de puntuaciones
list() {
  return this.http.get(this.url+this.key,{headers: this.headers});
}

//Crear puntuaciones
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar puntuaciones
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar puntuaciones
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}

ratings_by_evaluation(id){
  return this.http.get<any>(this.url_ratings_by_evaluation+id+this.key,{headers: this.headers});
}
}
