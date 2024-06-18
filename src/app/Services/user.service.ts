import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  baseUrl:string ='http://localhost:7000/api/v1'

constructor(private http: HttpClient, private authService: AuthService) {}




getUserById(id:any,header:any):Observable<any>{
 
  return this.http.get(`${this.baseUrl}/user/${id}`,{headers:header})
  }

  editUserInfo(id: any, userInfo: any, headers: HttpHeaders): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${id}`, userInfo, { headers })
  }

  

  uploadUserImage(id:any,imageFile:any,header:any):Observable<any>{

    return this.http.post(`${this.baseUrl}/user/${id}/upload-image`,imageFile,{headers:header})
  }

}
