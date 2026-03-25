import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { HomeComponent } from './user/home/home.component';
import { authGuard } from './shared/guard/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { adminGuard } from './shared/guard/admin.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatCardModule } from '@angular/material/card';
import { MyFavoritesComponent } from './user/my-favorites/my-favorites.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'my-favorites', component: MyFavoritesComponent, canActivate: [authGuard]},
  {
    path: 'admin',
    loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MatCardModule],
  exports: [RouterModule,MatCardModule],
})
export class AppRoutingModule {}
