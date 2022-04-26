import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import { IdleService } from 'src/app/services/idle.service';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
user = this.authService.getuserSession();
  constructor(public authService: AuthService,private idleService: IdleService) { 
    idleService.idle$.subscribe(s => console.log('cerrando sesión... '));
    //idleService.wake$.subscribe(s => console.log('Timmer reactivado!'));
}
  ngOnInit(): void {
  }

  //al hacer click en el boton "cerrar sesion"
logout()
{
this.authService.deleteToken();
}
profile(){
  window.location.href = "/profile";
}
}
