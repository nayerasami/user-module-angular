import { SocialMediaComponent } from './Components/social-media/social-media.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NotFoundComponent } from './Components/Shared/not-found/not-found.component';
import { ProfileComponent } from './Components/profile/profile.component';

const routes: Routes = [
  {path:'',component:ProfileComponent},
  {path:'social-media',component:SocialMediaComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
