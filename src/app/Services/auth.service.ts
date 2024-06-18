import { CookieServiceService } from './cookie-service.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string = '';
  private decodedUserToken: any;

  private loggedIn = false;
  private registered = false;

  baseUrl: string = 'http://localhost:7000/api/v1/auth'

  constructor(private http: HttpClient, private cookieService: CookieServiceService) {

  }

  isLoggedIn() {
    return this.loggedIn
  }

  isRegistered() {
    return this.registered
  }

  registerAuth(userInfo: any): Observable<any> {
    this.registered = true;
    return this.http.post(`${this.baseUrl}/register`, userInfo)
  }

  loginAuth(userInfo: any): Observable<any> {
    this.loggedIn = true;
    return this.http.post(`${this.baseUrl}/login`, userInfo)
  }

  verifyOTPAuth(verificationData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, verificationData)
  }

  setToken(accessToken: string) {
    this.cookieService.set('accessToken', accessToken);
  }

  getToken() {
    return this.cookieService.get('accessToken');
  }

  getLoggedDecodedUserData(): any {
    this.accessToken = this.getToken() || '';
    this.decodedUserToken = jwtDecode(this.accessToken);
    console.log("Decoded Token:", this.decodedUserToken);
    return this.decodedUserToken;
  }

  deleteToken() {
    this.cookieService.remove('accessToken');
  }


}
