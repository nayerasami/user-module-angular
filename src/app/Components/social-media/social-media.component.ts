import { AuthService } from './../../Services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { SocialService } from './../../Services/social.service';
import { Component, OnInit } from '@angular/core';

interface SocialPlatform {
  id: number;
  name: string;
  icon:string
}

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})

export class SocialMediaComponent implements OnInit {
  private accessToken: string = '';
  private registeredUser: any;
  public socialPlatforms : SocialPlatform[]=[];
  public selectedPlatform: SocialPlatform | null = null;


  constructor(private socialService: SocialService, private authService: AuthService) {
    this.accessToken = this.authService.getToken();
    console.log("user from socialplatform",this.registeredUser)
  }

  ngOnInit(): void {
   
    if (this.accessToken) {
      this.socialService.getAllSocialPlatforms(this.getHeaders()).subscribe({
        next: (response: any) => {
          console.log("Social platforms response", response);
          console.log(response?.data)
          this.socialPlatforms=response.data.SocialMediaPlatforms
          console.log("SocialMediaPlatforms",this.socialPlatforms)
        },
        error: error => {
          console.log("Social error", error);
        }
      });
    } else {
      console.error('User not authenticated');
    }
  }

  private getHeaders(): HttpHeaders {
    console.log('Headers access token', this.accessToken);
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  onSelectPlatform(platform: SocialPlatform): void {
    this.selectedPlatform = platform;
  }
}
