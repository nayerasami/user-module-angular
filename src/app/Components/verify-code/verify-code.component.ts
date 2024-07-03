import { Router } from '@angular/router';
import { AuthService } from './../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  accessToken: string = '';
  userDetails: any;
  registeredUser:any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registeredUser = this.authService.getToken();
    console.log("access token  from verify code page",this.registeredUser.user.accessToken)
    this.accessToken=this.registeredUser.user.accessToken
    if (this.accessToken && typeof this.accessToken === 'string') {
      try {
        const decodedUserToken: any = jwtDecode(this.accessToken);
        this.userDetails = decodedUserToken;
        this.populateForm(this.userDetails);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Invalid access token");
    }
  }

  verifyForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email
    ]),
    otp: new FormControl('', [
      Validators.required
    ])
  });

  get email() {
    return this.verifyForm.get('email');
  }

  get otp() {
    return this.verifyForm.get('otp');
  }

  verify(): void {
    if (this.verifyForm.valid) {
      const verificationData = {
        email: this.userDetails.email,
        otp: this.verifyForm.get('otp')?.value
      };

      this.authService.verifyOTPAuth(verificationData).subscribe({
        next: response => {
          console.log("Response:", response);
          this.router.navigate(['/']);
        },
        error: error => {
          console.error('Error verifying your email:', error);
        }
      });
    } else {
      console.log('Enter valid OTP');
    }
  }

  private populateForm(userDetails: any): void {
    this.verifyForm.patchValue({
      email: userDetails.email
    });
  }
}
