import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
   let  user= this.authService.getuserSession();
   if(user.id_user_category == 1){
    window.location.href = "/admin-dashboard";
  }else if (user.id_user_category == 2){
    window.location.href = "/manager-dashboard";
  }else if (user.id_user_category == 3){
    window.location.href = "/employee-dashboard";
  }else{
    window.location.href = "/login";
  }
  
  }

}
