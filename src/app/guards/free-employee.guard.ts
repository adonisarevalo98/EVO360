import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FreeEmployeeGuard implements CanActivate {
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
         let user = this.authService.getuserSession();
         if (user.id_user_category==3 ) {
             return true;
           } else{
             this.url='/index'
           }
        
         }else{
           this.url='/index'
         }
       
       
       this.router.navigate([this.url], {queryParams: { returnUrl: routeurl }} );
       }
  
}
