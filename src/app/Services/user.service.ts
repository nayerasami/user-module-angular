import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl:string ='http://localhost:7000/api/v1'
 private accessToken:String=''
  constructor(private http:HttpClient,private authService:AuthService) { 
  this.accessToken=authService.getToken()
  }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }


  getUserById(id:any):Observable<any>{
 
  return this.http.get(`${this.baseUrl}/user/${id}`,{headers:this.getHeaders()})
  }

  editUserInfo (id:any,userInfo:any): Observable<any>{

  return this.http.put(`${this.baseUrl}/user/${id}`,userInfo,{headers:this.getHeaders()})
  }

  uploadUserImage(id:any,imageFile:any):Observable<any>{

    return this.http.post(`${this.baseUrl}/user/${id}/upload-image`,imageFile,{headers:this.getHeaders()})
  }

}
