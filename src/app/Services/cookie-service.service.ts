import { Injectable } from '@angular/core';
import Cookies, { Cookie } from 'universal-cookie';

@Injectable({
  providedIn: 'root'
})
export class CookieServiceService {
  private cookies:Cookie;
  constructor() { 
    this.cookies =new Cookies()
  }
  set(key: string, value: any, options?: any): void {
    this.cookies.set(key, value, options);
  }

  get(key: string): any {
    return this.cookies.get(key);
  }

  remove(key: string, options?: any): void {
    this.cookies.remove(key, options);
  }
}
