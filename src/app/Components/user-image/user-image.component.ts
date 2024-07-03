import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../Services/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.css']
})
export class UserImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;

  
  uploadSuccess = false;
  uploadError = false;


  private userId: number | undefined;
  private accessToken: string = '';
  private registeredUser: any;
  imageUrl: string | null = null;
  userImageURL:string |null =''

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.registeredUser = this.authService.getLoggedDecodedUserData();
    // if (!this.registeredUser || !this.registeredUser.id) {
    //   console.error("User ID not found or invalid.");
    //   return;
    // }
    // this.userId = this.registeredUser.id;
    this.accessToken = this.authService.getToken();
    this.registeredUser =this.authService.getLoggedDecodedUserData(this.accessToken)
    this.userId =this.registeredUser.id
    this.getUserImage()
  }

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] || null;
    console.log("selectedFile",this.selectedFile)
    if (this.selectedFile) {
      this.uploadImage();
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }
  getUserImage(){
    this.userService.getUserById(this.userId,this.getHeaders()).subscribe({
      next:(response:any)=>{
      this.userImageURL = response.data.user.image;
      this.imageUrl=this.userImageURL;
      console.log("user already have an image" ,this.userImageURL)
      },error:(error)=>{
        console.error("error:", error);
      }
    })
  }
  uploadImage() {
    if (!this.selectedFile || !this.userId || !this.accessToken) {
      console.error("File, user ID, or access token not available.");
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.userService.uploadUserImage(this.userId, formData, this.getHeaders()).subscribe({
      next: (response: any) => {
        this.imageUrl = response.user.image;
        this.userImageURL=this.imageUrl;
  
        console.log("IMage url",this.imageUrl)
        console.log("Upload successful:", response);

        this.uploadSuccess = true;
        this.uploadError = false;
      },
      error: (error) => {
        console.error("Upload error:", error);
        this.uploadSuccess = false;
        this.uploadError = true;
      }
    });
  }
}
