import { CookieServiceService } from './cookie-service.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  baseUrl:string ='http://localhost:7000/api/v1/auth'

  constructor(private http:HttpClient , private cookieService:CookieServiceService) { 

  }

  

  registerAuth (userInfo:any): Observable<any>{
  return this.http.post(`${this.baseUrl}/register`,userInfo)
  }

  loginAuth(userInfo:any): Observable<any>{
  return  this.http.post(`${this.baseUrl}/login`,userInfo)
  }


  setToken(accessToken: string) {
    this.cookieService.set('accessToken', accessToken);
  }

  getToken() {
    return this.cookieService.get('accessToken');
  }
 
  deleteToken() {
    this.cookieService.remove('accessToken');
  }


}
