import { Router } from '@angular/router';
import { AuthService } from './../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
constructor(private authService:AuthService ,private router:Router){}
  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  userForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]), phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(20),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  })

  get getFirstName() {
    return this.userForm.controls['firstName']
  }

  get getLastName() {
    return this.userForm.controls['lastName']
  }

  get getPhoneNumber() {
    return this.userForm.controls['phoneNumber']
  }

  get getEmail() {
    return this.userForm.controls['email']
  }

  get getPassword() {
    return this.userForm.controls['password']
  }

  get getConfirmPassword() {
    return this.userForm.controls['confirmPassword']
  }



  register(): any {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.authService.registerAuth(this.userForm.value).subscribe({
        next: response => {
          console.log('Registration successful', response);
          const accessToken = response.data;
          this.authService.setToken(accessToken);
          console.log("data",accessToken)
          this.router.navigate(['/verify-otp']);

        },
        error: error => {
          console.error('Registration error', error);

        }
      });
    } else {
      console.log("Enter valid info");
    }
  }
}


