import { SocialMediaComponent } from './Components/social-media/social-media.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NotFoundComponent } from './Components/Shared/not-found/not-found.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { VerifyCodeComponent } from './Components/verify-code/verify-code.component';
import { DashboardComponent } from './Components/Shared/dashboard/dashboard.component';
import { AuthLayoutComponent } from './Components/Shared/auth-layout/auth-layout.component';
import { AuthGuard } from './Gaurds/auth.guard';
import { OtpGaurdGuard } from './Gaurds/otp-gaurd.guard';

const routes: Routes = [

  { path: '', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'social-media', component: SocialMediaComponent }
    ]
  },
  { path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'verify-otp', canActivate: [OtpGaurdGuard],
        component: VerifyCodeComponent},
      { path: 'register', component: RegisterComponent },
    ] 
  },
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
