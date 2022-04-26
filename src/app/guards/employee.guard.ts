import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {
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
          let usercat = user.id_user_category
          if (usercat==1 ||((usercat==2 || usercat==3) && user.company_status==1)) {
              return true;
            } else{
              this.url='/employee-denied'
            }
         
          }else{
            this.url='/index'
          }
        
        
        this.router.navigate([this.url], {queryParams: { returnUrl: routeurl }} );
        }
  
}
