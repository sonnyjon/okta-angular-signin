import { Component, OnDestroy } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Subscription } from 'rxjs';
import { ErrorRelayService } from './service/error-relay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy
{
  isAuthenticated: boolean = false;

  oktaError: Error;
  errorSub: Subscription;

  constructor(public oktaAuth: OktaAuthService,
              private relayService: ErrorRelayService)
  {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated
      },
      error => {
        this.relayService.setError(error);
      }
    );

    // Subscribe to Okta errors caused in other components
    this.errorSub = this.relayService.errorChanged.subscribe(
      error => {
        this.oktaError = error;
        this.alertError();
      }
    );
  }

  //--------------------------------------------------------------------------
  ngOnDestroy()
  {
    this.errorSub.unsubscribe();
  }
  //--------------------------------------------------------------------------
  async ngOnInit()
  {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();                        
  }
  //--------------------------------------------------------------------------
  alertError()
  {
    alert(`ERROR: ${this.oktaError}`);
    this.logout();
  }
  //--------------------------------------------------------------------------
  login()
  {
    this.oktaError = null;

    this.oktaAuth.signInWithRedirect({
      originalUri: '/profile'      
    });  
  }
  //--------------------------------------------------------------------------
  logout()
  {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
    sessionStorage.clear();
  }
}
