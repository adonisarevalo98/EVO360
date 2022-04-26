import { Injectable } from '@angular/core';
import {ResourcesService} from './resources.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //Objeto que almacena las unicas categorias de usuario disponibles 
user_categories=[
  { id:1,
    category:"Administrador"
  },
  { 
    id:2,
    category:"Gestor de evaluaciones"
  },
  { 
     id:3,
    category:"Empleado"
  }
];
//Objeto que almacena los unicos estados de perfil disponible
userstatus;

  constructor(public resourceService: ResourcesService, private http: HttpClient) { }

  //obteniendo la URL base de la API en Laravel y la llave del middleware
url = this.resourceService.baseUrl_users;
url_status = this.resourceService.baseUrl_userStatus;
url_categories = this.resourceService.baseUrl_users_categories;
key = this.resourceService.Key;

//cabeceras
headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+localStorage.getItem('token'));

//url para lista de usuarios en dashboard de adminsitrador
url_list = this.resourceService.baseUrl_list_users;
//url para datos de sesión
url_getdata = this.resourceService.baseUrl_getdata;
//url para lista de usuarios por departamento
url_users_by_department = this.resourceService.baseUrl_users_by_department;
//url para lista de usuarios que no son evaluadores
url_arent_evaluators = this.resourceService.baseUrl_arent_evaluators;

//Lista de status
list_status() {
return this.http.get(this.url_status+this.key,{headers: this.headers});
} 

//Lista de categorias
list_categories() {
  return this.http.get(this.url_categories+this.key,{headers: this.headers});
  } 

//lista de todos los usuarios excepto el usuario que solicita los datos 
list(id: number,id_company:number) {
  let data={
      id:id,
      id_company:id_company,
      api_key: this.resourceService.appkey
  }
  return this.http.post<any>(this.url_list,data,{headers: this.headers});
}

//insertar nuevo usuario
create(user) {
  const headers = new HttpHeaders({'Content-Type':'application/json'}); 
    
    return this.http.post<any>( this.url+this.key, user,{headers: this.headers});
}

//eliminar un usuario
delete(id: number) {
  return this.http.delete(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener los datos de un usuario segun su id
select(id: number) {
  return this.http.get(this.url+'/'+id+this.key,{headers: this.headers});
}

//obtener todos los datos de sesión de un usuario autenticado
getdata(email,token) {
  let headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization','Bearer '+token);
  console.log(headers)
  return this.http.post<any>(this.url_getdata+this.key,{email},{headers: headers});
}

//editar datos de un usuario
update(user) {
  return this.http.put(this.url+'/'+user.id+this.key,user,{headers: this.headers});
 
}

//lista de todos los usuarios (en estado activo) menos administradores, incluye su cargo y departamento 
users_by_department(id:number) {
  return this.http.get<any>(this.url_users_by_department+id+this.key,{headers: this.headers});
}
//Lista de usuarios de UNA empresa que NO son evaluadores de una evaluación ESPECIFICA
arent_evaluators(id_evaluation,id_company) {
  return this.http.get<any>(this.url_arent_evaluators+id_evaluation+'/'+id_company+this.key,{headers: this.headers});
}
}
