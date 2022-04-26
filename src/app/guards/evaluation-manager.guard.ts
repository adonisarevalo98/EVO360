import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EvaluationManagerGuard implements CanActivate {
  
  //Variable que almacena la ruta a redireccionar
  url='';
  constructor(
    public authService: AuthService,
    public router: Router
  ){}
  //Protegiendo zona de administrador
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const routeurl: string = state.url;
      return this.isLogin(routeurl);
      }
      isLogin(routeurl: string):any {
        //Si el usuario ha iniciado sesión
        if (this.authService.isLoggedIn()){
          let user = this.authService.getuserSession();
          //Si el usuario es administrador || si es gestor y pertenece a una empresa activa
          if (user.id_user_category==1 || (user.id_user_category==2 && user.company_status==1)) {
              return true;
            }else{
              this.url='/manager-denied'
            }  
         
          }else{
            this.url = '/index'
          }
        
        this.router.navigate([this.url], {queryParams: { returnUrl: routeurl }} );
        }
  
}
