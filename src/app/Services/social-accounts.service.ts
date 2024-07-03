import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialAccountsService {
  baseUrl: string = 'http://localhost:7000/api/v1/social-accounts'

  constructor(private http: HttpClient) { }

  getAllSocialAccounts(header: any) {
    return this.http.get(`${this.baseUrl}`, { headers: header })
  }

  getSocialAccountById(id: any, header: any) {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: header })
  }
  addNewSocialAccount(socialAccountInfo: any, header: any) {
    return this.http.post(`${this.baseUrl}`, socialAccountInfo, { headers: header })
  }

  editSocialAccount(id: any, socialAccountInfo: any, header: any) {
    return this.http.put(`${this.baseUrl}/${id}`, socialAccountInfo, { headers: header })
  }

  deleteSocialAccount(id: any, header: any) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: header })
  }
}
