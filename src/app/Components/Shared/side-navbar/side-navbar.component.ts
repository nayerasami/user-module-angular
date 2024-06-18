import { Router } from '@angular/router';
import { AuthService } from './../../../Services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent {
  constructor(private authService:AuthService,private router:Router){}
  logout(){
this.authService.deleteToken()
this.router.navigate(['/login'])
  }
}
