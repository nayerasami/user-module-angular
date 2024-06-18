import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../Services/auth.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.css']
})
export class UserImageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  uploadSuccess = false;
  uploadError = false;
  private userId: number | undefined;
  private accessToken: string = '';
  private registeredUser: any;

  constructor(private userService: UserService, private authService: AuthService) { }

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] || null;
    if (this.selectedFile) {
      this.uploadImage();
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  uploadImage() {
    if (!this.selectedFile) {
      return;
    }

    this.registeredUser = this.authService.getToken();
    this.accessToken = this.registeredUser.user.accessToken;

    const decodedUserToken: any = jwtDecode(this.accessToken);
    console.log("Decoded Token:", decodedUserToken);

    this.userId = decodedUserToken.id;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.userService.uploadUserImage(this.userId, formData, this.getHeaders()).subscribe({
      next: (response) => {
        console.log("Response:", response);
        this.uploadSuccess = true;
        this.uploadError = false;
      },
      error: (error) => {
        console.error("Error:", error);
        this.uploadSuccess = false;
        this.uploadError = true;
      }
    });
  }
}
