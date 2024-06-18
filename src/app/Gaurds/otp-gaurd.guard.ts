import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class OtpGaurdGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authService.isRegistered()) {
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }
};
