import { AuthService } from './../../Services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { SocialService } from './../../Services/social.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAccountsService } from 'src/app/Services/social-accounts.service';

interface SocialPlatform {
  id: number;
  name: string;
  icon: string
}

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})

export class SocialMediaComponent implements OnInit {
  private accessToken: string = '';
  private registeredUser: any;
  public socialPlatforms: SocialPlatform[] = [];
  public selectedPlatform: SocialPlatform | null = null;
  private userId: number | undefined;
  private socialMediaPlatformsId: number | undefined;
  socialAccountInfo: any;


  constructor(private socialService: SocialService, private authService: AuthService, private socialAccountService: SocialAccountsService) {
    this.accessToken = this.authService.getToken();
    this.registeredUser = authService.getLoggedDecodedUserData(this.accessToken)
    console.log("user from social platform", this.registeredUser)
    this.userId = this.registeredUser.id
    console.log(this.userId)
  }

  ngOnInit(): void {

    if (this.accessToken) {
      this.socialService.getAllSocialPlatforms(this.getHeaders()).subscribe({
        next: (response: any) => {
          console.log("Social platforms response", response);
          console.log(response?.data)
          this.socialPlatforms = response.data.SocialMediaPlatforms
          console.log("SocialMediaPlatforms", this.socialPlatforms)
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
    this.socialMediaPlatformsId = this.selectedPlatform.id
    console.log("sociallllll", this.socialMediaPlatformsId)
    if (this.socialMediaPlatformsId) {
      this.socialAccountService.getSocialAccountById(this.socialMediaPlatformsId,
        this.getHeaders()).subscribe({
          next: (response: any) => {
            if (response?.data?.socialAccount) {
              console.log('Response for selected social media:', response.data.socialAccount);
              this.populateForm(response.data.socialAccount);
            } else {
              console.log('No social account found for the selected platform');
              this.handleNoSocialAccountFound();
            }
          },
          error: (err) => {
            if (err.status === 404) {
              this.handleNoSocialAccountFound();
            } else {
              console.error('Error fetching social account:', err);
            }

          }
        })
    } else {
      console.log(`this user dosen't have a social account here`)
    }

  }
  private handleNoSocialAccountFound(): void {
    this.socialForm.reset();
    console.log('No social account found for the selected platform');
  }

  socialForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required
    ]),
    socialLink: new FormControl('', [
      Validators.required
    ])
  })

  get getUserName() {
    return this.socialForm.controls['userName']
  }

  get getAccountLink() {
    return this.socialForm.controls['socialLink']
  }

  private populateForm(socialAccount: any): void {

    this.socialForm.patchValue({
      userName: socialAccount.userName,
      socialLink: socialAccount.socialLink
    })
  }

  addNewSocialAccount(): void {
    console.log("social accounts form ", this.socialForm)
    if (this.socialForm.status === 'VALID') {

      console.log(this.socialForm.value)
      console.log("this is the selected platform from adding new social", this.selectedPlatform)
      this.socialAccountInfo = {
        socialMediaPlatformsId: this.socialMediaPlatformsId,
        userId: this.userId,
        ...this.socialForm.value
      }
      this.socialAccountService.addNewSocialAccount(this.socialAccountInfo, this.getHeaders()).subscribe({
        next: (response) => {
          console.log(response)

        }, error: (err) => {
          console.log("error", err)
        }
      })

    } else {
      console.error('enter valid data')
    }

  }

  deleteSocialAccount(): void {

    this.socialAccountService.deleteSocialAccount(this.socialMediaPlatformsId, this.getHeaders()).subscribe({
      next: (response: any) => {
        console.log("deleting response", response)
        this.handleNoSocialAccountFound()
      }, error: (error) => {
        console.log(error)
      }
    })
  }

}
