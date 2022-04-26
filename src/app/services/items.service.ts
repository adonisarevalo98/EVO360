import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

    //Objeto que almacena los únicos tipos item disponibles 
question_types=[
 /* { id:0,
    type:"Pregunta abierta"
  },*/
  { 
    id:1,
    type:"Pregunta cerrada"
  }
];

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }
 
  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_items;
key = this.resourceService.Key;

//Url para lista de items segun la plantilla seleccionada
url_list = this.resourceService.baseUrl_items_list

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

  
//Lista de items
list() {
  return this.http.get<any>(this.url+this.key,{headers: this.headers});
}

//Crear items
create(data) { 
    return this.http.post<any>( this.url+this.key, data,{headers: this.headers});
}

//eliminar items
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//editar items
update(data) {
  return this.http.put(this.url+'/'+data.id+this.key,data,{headers: this.headers});
}

//Lista de items segun el template seleccionado
list_by_template(id: number) {
  return this.http.get<any>(this.url_list+id+this.key,{headers: this.headers});
}

}
