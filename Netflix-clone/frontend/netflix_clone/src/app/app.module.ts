import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from './shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { HomeComponent } from './user/home/home.component';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthService } from './shared/services/auth-service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { A11yModule } from "@angular/cdk/a11y";
import { MyFavoritesComponent } from './user/my-favorites/my-favorites.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignupComponent,
    LoginComponent,
    VerifyEmailComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MyFavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    A11yModule,
],
  providers: [
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.initialzeAuth();
    }),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
