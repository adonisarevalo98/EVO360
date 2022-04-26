import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
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
        if (this.authService.isLoggedIn()){
          let user
          try {
           user = this.authService.getuserSession();
          } catch (error) {
            
          }
        
        if (user.id_user_category==1) {
          
            return true;
          }  
       
        }else{
        this.url='/login';
        }
        
        this.router.navigate([this.url], {queryParams: { returnUrl: routeurl }} );
        }
  
}
