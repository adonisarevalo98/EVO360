import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UsersService } from 'src/app/services/users.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  //Cargando propiedades de material (Paginator y sort) del Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public user = this.authService.getuserSession();
  
 /****************************************** VARIABLES LOCALES **************************************** */

 //Columnas de la tabla
 displayedColumns = ['#', 'Nombre','Departamento', 'Categoría', 'Estado', 'Acción'];

 
  //para carga de pantalla
  public load: boolean;


  //arreglo para almacenar usuarios
  users = new MatTableDataSource();

  //arreglo que almacena la lista de empresas existentes
 companies;
   //variable que almacena lo digitado en el buscador 
   text: string;

   //Variable que almacena el id de la empresa seleccionada (para administradores)
   //por defecto se establece el id de la empresa del usuario logueado
   id_company = this.user.id_company;


/********************************************************************************************************* */
  constructor(public authService: AuthService, public userService: UsersService,
    public localService: LocalstorageService, public toastr: ToastrService,
    public companyService:CompaniesService) { }

    
      ngOnInit(): void {
       
         //Llamada al método para lista de empresas
      this.List_Companies();
      //Llamada de usuarios 
      this.ListUsers();
      }
     
       /********************************************************************************************************* */
    //Método para listar a las empresas disponibles (activadas o desactivadas)
    List_Companies(){
      this.companyService.list().subscribe(data=>{
        this.companies = data;
      })
    }
     /********************************************************************************************************* */
      //Uso del método "list" para obtener la lista de usuarios (sin incluir al que solicita los datos)
    ListUsers() {
      this.load=false;
      this.userService.list(this.user.id_usr,this.id_company).subscribe((result) =>{
        this.users.data = result;
        this.users.sort = this.sort;
        this.users.paginator = this.paginator;
        setTimeout(() => {
          this.load=true;
        }, 3000); 
      } );
      }

       /********************************************************************************************************* */
  //método que consume el método "delete" en el users.service para eliminar al usuario seleccionado
      delete(code) {
  //uso de sweetalert2 para validar el proceso 
        Swal.fire({
          title: '¡ALERTA!',
          text: "Esta a punto de eliminar a un usuario,  ¿Desea continuar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.userService.delete(code).subscribe(data => {
              if (data['result'] == 'OK') {
                Swal.fire(
                  'Eliminado!',
                  'El usuario ha sido eliminado',
                  'success'
                )
              this.ListUsers();
              }else if (data['result'] == 'ERROR'){
                Swal.fire(
                  'Error!',
                  'El usuario no ha sido eliminado',
                  'error'
                )
              }
              });
            
          }
        })

        }
   /********************************************************************************************************* */  
  //Uso del metodo "setSelectedId" del updates.service para almacenar el id del usuario seleccionado 
        update(code){
          
          this.localService.setSelectedId(code);
        }
 /********************************************************************************************************* */
         //Buscador
         applyFilter(filterValue: string) {
          filterValue = filterValue.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.users.filter = filterValue;
      }

}
