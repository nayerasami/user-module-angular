import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../Services/auth.service';
import { UserService } from './../../Services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  private accessToken: string = '';
  private userId: number | undefined;
  private userDetails: any;
  private registeredUser:any;


  userProfileInfo = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    arabicFullName: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(150)
    ]),
    englishFullName: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(150)
    ]),
    nationality: new FormControl(''),
    birthDate: new FormControl(''),
    country: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(30)
    ]),
    city: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(30)
    ]),
    fullAddress: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(150)
    ]),
    bio: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(250)
    ])
  });
  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.registeredUser = this.authService.getToken();
    this.accessToken=this.registeredUser.user.accessToken;
    console.log("access token from profile ",this.accessToken)
    if (this.accessToken) {
      try {
        const decodedUserToken: any = jwtDecode(this.accessToken);
        console.log("Decoded Token:", decodedUserToken);

        this.userId = decodedUserToken.id;
        if (this.userId) {
          this.userService.getUserById(this.userId,this.getHeaders()).subscribe({
            next: response => {
              this.userDetails = response.data.user;
              console.log("User details:", this.userDetails);
              this.populateForm(this.userDetails);
            },
            error: (error: HttpErrorResponse) => {
              console.error("Error fetching user details:", error);
              if (error.status === 401) {
                console.error("Unauthorized - Token may be expired or invalid.");
              }
            }
          });
        } else {
          console.warn("User ID not found in decoded token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("Access token not found or expired.");
    }

  }
  private getHeaders(): HttpHeaders {
    console.log('headers access token ',this.accessToken)
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }


  private populateForm(userDetails: any): void {
    this.userProfileInfo.patchValue({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    });
  }
  editUserInfo(): void {
    if (this.userProfileInfo.valid) {
      console.log(this.userProfileInfo.value);
      this.userService.editUserInfo(this.userId, this.userProfileInfo.value, this.getHeaders()).subscribe({
        next: response => {
          console.log("Edit response:", response);
          // Optionally handle success response
        },
        error: (error: HttpErrorResponse) => {
          console.error('Editing error:', error);
          if (error.status === 400 && error.error?.validationErr) {
            const validationErrors: ValidationErrors[] = error.error.validationErr;
            this.handleValidationErrors(validationErrors);
          }
        }
      });
    } else {
      console.log('Please enter valid user data.');
      this.userProfileInfo.markAllAsTouched(); // Ensure validation errors are displayed
    }
  }

  private handleValidationErrors(validationErrors: any[]): void {
    // Example: Reset validation errors and mark fields as invalid
    this.userProfileInfo.setErrors({ serverError: true });
    validationErrors.forEach(error => {
      const control = this.userProfileInfo.get(error.field); // Adjust 'field' based on actual API response
      if (control) {
        control.setErrors({ serverError: error.message });
      }
    });
  }
}
