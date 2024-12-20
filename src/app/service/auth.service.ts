// webauthn.service.ts

import { Injectable } from '@angular/core';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

@Injectable({
  providedIn: 'root',
})
export class WebAuthnService {
  
  // private serverUrl = 'http://localhost:3000';

  private serverUrl = 'https://expresspasskey.vercel.app';

  async signup(email: string): Promise<string> {
    // 1. Get challenge from server
    console.log('signup email avalable here', email);
    const initResponse = await fetch(`${this.serverUrl}/init-register?email=${email}`, {
      credentials: 'include',
    });
    const options = await initResponse.json();
    console.log('sign up options', options);
    if (!initResponse.ok) {
      return options.error;
    }
    console.log('opetions', options);
    // 2. Create passkey
    const registrationJSON = await startRegistration({optionsJSON:options});
    console.log('registrationJSON', registrationJSON);
    // 3. Save passkey in DB
    const verifyResponse = await fetch(`${this.serverUrl}/verify-register`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationJSON),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) {
      return verifyData.error;
    }
    console.log(verifyData.verified);
    return verifyData.verified ? `Successfully registered ${email}` : 'Failed to register';
  }

  async login(email: string): Promise<string> {
    // 1. Get challenge from server
    console.log('login email avalable here', email);
    const initResponse = await fetch(`${this.serverUrl}/init-auth?email=${email}`, {
      credentials: 'include',
    });
    console.log('opitions avalable now', initResponse);
    const options = await initResponse.json();
    if (!initResponse.ok) {
      return options.error;
    }

    // 2. Get passkey
    console.log('get passkey');
    const authJSON = await startAuthentication({optionsJSON:options});
    console.log('authentication started');
    // 3. Verify passkey with DB
    const verifyResponse = await fetch(`${this.serverUrl}/verify-auth`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authJSON),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) {
      return verifyData.error;
    }
    console.log(verifyData.verified);

    return verifyData.verified ? `Successfully logged in ${email}` : 'Failed to log in';
  }
}
