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
  private registeredUserToken: any;

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
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(11), // Assuming minimum length requirement
      Validators.pattern(/^\d{11}$/) // Assuming numeric format requirement
    ]),
    imageUrl: new FormControl(''),
    gender: new FormControl('female', [
      Validators.required,
      Validators.pattern(/^(male|female)$/i) // Assuming valid gender values
    ]),
    birthDate: new FormControl(''),
    nationality: new FormControl(''),
    bio: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(250)
    ]),
    fullNameArabic: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(150)
    ]),
    fullNameEnglish: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(150)
    ]),
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
    ])
  });

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.registeredUserToken = this.authService.getToken();
    if (this.registeredUserToken) {
      try {
        const decodedUserToken: any = jwtDecode(this.registeredUserToken);
        this.userId = decodedUserToken.id;
        if (this.userId) {
          this.userService.getUserById(this.userId, this.getHeaders()).subscribe({
            next: response => {
              this.userDetails = response.data.user;
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
    return new HttpHeaders({
      'Authorization': `Bearer ${this.registeredUserToken}`
    });
  }

  private populateForm(userDetails: any): void {
    this.userProfileInfo.patchValue({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      imageUrl: userDetails.imageUrl,
      gender: userDetails.gender,
      birthDate: userDetails.birthDate,
      nationality: userDetails.nationality,
      bio: userDetails.bio,
      fullNameArabic: userDetails.fullNameArabic,
      fullNameEnglish: userDetails.fullNameEnglish,
      country: userDetails.country,
      city: userDetails.city,
      fullAddress: userDetails.fullAddress
    });
  }

  editUserInfo(): void {
    if (this.userProfileInfo.valid) {
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
          } else {
            // Handle other types of errors (e.g., server errors)
            // Display a generic error message to the user
            // Example: this.errorMessage = 'An error occurred while saving.';
          }
        }
      });
    } else {
      console.log('Please enter valid user data.');
      this.userProfileInfo.markAllAsTouched(); // Ensure validation errors are displayed
    }
  }

  private handleValidationErrors(validationErrors: any[]): void {
    validationErrors.forEach(error => {
      const control = this.userProfileInfo.get(error.field); // Adjust 'field' based on actual API response
      if (control) {
        control.setErrors({ serverError: error.message });
      }
    });
  }
}
