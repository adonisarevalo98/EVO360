import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user = this.authService.getuserSession();
  //Variable para gestionar las opciones del sidebar según la categoria de usuario
 $sidebar=null;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    if(this.user.id_user_category==1){
     this.$sidebar=1;
    }else if(this.user.id_user_category==2){
      this.$sidebar=2;
    }else if(this.user.id_user_category==3){
      this.$sidebar=3;
    }
  }

}
