import { AuthService } from './../../Services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isPasswordVisible = false;
  constructor(private authService: AuthService, private router: Router) {

  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/)

      // Password must contain one digit from 1 to 9, one lowercase letter,
      // one uppercase letter,
      // and one underscore, and it must be 8-16 characters long. 
      //Usage of any other special character and usage of space is optional.
      //Nayera11_3

    ])
  })

  get getEmail() {
    return this.userForm.controls['email']
  }

  get getPassword() {
    return this.userForm.controls['password']
  }

  login(): any {
    if (this.userForm.valid) {
      console.log(this.userForm.value)
      this.authService.loginAuth(this.userForm.value).subscribe({
        next: response => {
          console.log('Registration successful', response);
          const accessToken = response.data.accessToken;
          console.log("accessToken", accessToken)
          this.authService.setToken(accessToken);
          this.router.navigate(['/'])

        }, error: error => {
          console.error('login error', error)
        }
      })

    } else {

      console.log('enter valid info')

    }

  }




}
