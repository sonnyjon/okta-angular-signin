import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment.prod';

import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaAuthGuard,
} from '@okta/okta-angular';

const env = environment;

const config = {
  clientId: `${env.clientId}`,
  issuer: `https://${env.oktaDomain}/oauth2/default`,
  redirectUri: `${env.baseUrl}/login/callback`,
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ErrorRelayService } from './service/error-relay.service';
import { CallbackComponent } from './callback/callback.component';

const CALLBACK_PATH = 'login/callback';

const routes: Routes = [
  {
    path:'profile', 
    pathMatch: 'full',
    component: ProfileComponent, 
    canActivate: [OktaAuthGuard]
  },
  // {path: CALLBACK_PATH, component: OktaCallbackComponent}, // Doesn't work
  {
    path: CALLBACK_PATH, 
    pathMatch: 'full',
    component: CallbackComponent
  },
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    CallbackComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    OktaAuthModule
  ],
  providers: [
    {provide: OKTA_CONFIG, useValue: config},
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true    
    },
    ErrorRelayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
