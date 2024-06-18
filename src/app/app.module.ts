import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { SocialMediaComponent } from './Components/social-media/social-media.component';
import { SideNavbarComponent } from './Components/Shared/side-navbar/side-navbar.component';
import { NotFoundComponent } from './Components/Shared/not-found/not-found.component';
import { DashboardComponent } from './Components/Shared/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { CookieServiceService } from './Services/cookie-service.service';
import { VerifyCodeComponent } from './Components/verify-code/verify-code.component';
import { UserImageComponent } from './Components/user-image/user-image.component';
import { AuthLayoutComponent } from './Components/Shared/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SocialMediaComponent,
    SideNavbarComponent,
    NotFoundComponent,
    DashboardComponent,
    VerifyCodeComponent,
    UserImageComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CookieServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
