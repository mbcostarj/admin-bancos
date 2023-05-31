import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  userName: string = "";

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router:Router
  ){

  }

ngOnInit(): void{
  this.getUserName();
}

logout(){
  this.authService.logout();
  this.router.navigate(['login']);
}

getUserName(){
  this.userName = this.tokenService.getUserName();
}

}
