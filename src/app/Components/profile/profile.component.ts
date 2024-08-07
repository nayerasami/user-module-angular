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
  editSuccess = false;
  editError = false

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
    fullNameArabic: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(150)
    ]),
    fullNameEnglish: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(150)
    ]),
    birthDate: new FormControl(''),
    nationality: new FormControl(''),
    gender: new FormControl('', [
      Validators.required
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
    ]),
    bio: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(250)
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
      gender: userDetails.gender,
      fullNameArabic: userDetails.fullNameArabic,
      fullNameEnglish: userDetails.fullNameEnglish,
      birthDate: userDetails.birthDate,
      nationality: userDetails.nationality,
      country: userDetails.country,
      city: userDetails.city,
      fullAddress: userDetails.fullAddress,
      bio: userDetails.bio
    });
  }


  get getFirstName() {
    return this.userProfileInfo.controls['firstName']
  }

  get getLastName() {
    return this.userProfileInfo.controls['lastName']
  }
  get getFullNameAr() {
    return this.userProfileInfo.controls['fullNameArabic']
  }
  get getFullNameEn() {
    return this.userProfileInfo.controls['fullNameEnglish']
  }
  get getGender() {
    return this.userProfileInfo.controls['gender']
  }
  get getCountry() {
    return this.userProfileInfo.controls['country']
  }
  get getCity() {
    return this.userProfileInfo.controls['city']
  }
  get getFullAddress() {
    return this.userProfileInfo.controls['fullAddress']
  }
  get getBio() {
    return this.userProfileInfo.controls['bio']
  }

  editUserInfo(): void {
    console.log("userProfileInfo", this.userProfileInfo)
    if (this.userProfileInfo.valid) {
      this.userService.editUserInfo(this.userId, this.userProfileInfo.value, this.getHeaders()).subscribe({
        next: response => {
          console.log("Edit response:", response);
          this.editSuccess = true;
          this.editError = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Editing error:', error);
          this.editSuccess = false;
          this.editError = true;
          // if (error.status === 400 && error.error?.validationErr) {
          //   const validationErrors: ValidationErrors[] = error.error.validationErr;
          //   this.handleValidationErrors(validationErrors);
          // } else {
          //   // Handle other types of errors (e.g., server errors)
          //   // Display a generic error message to the user
          //   // Example: this.errorMessage = 'An error occurred while saving.';
          // }
        }
      });
    } else {
      console.log('Please enter valid user data.');
      // this.userProfileInfo.markAllAsTouched(); // Ensure validation errors are displayed
    }
  }

  // private handleValidationErrors(validationErrors: any[]): void {
  //   validationErrors.forEach(error => {
  //     const control = this.userProfileInfo.get(error.field); // Adjust 'field' based on actual API response
  //     if (control) {
  //       control.setErrors({ serverError: error.message });
  //     }
  //   });
  // }
}
