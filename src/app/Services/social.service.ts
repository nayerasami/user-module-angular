import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialService {


  baseUrl: string = 'http://localhost:7000/api/v1/social-platforms'

  constructor(private http: HttpClient) { }

  getAllSocialPlatforms(header: any) {
    return this.http.get(`${this.baseUrl}`, { headers: header })
  }
  getSocialPlatFormById(id: any, header: any) {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: header })
  }

  addNewSocialPlatform(socialPlatformData:any,header: any) {
    return this.http.post(`${this.baseUrl}`,socialPlatformData,{ headers: header })
  }



  
}
