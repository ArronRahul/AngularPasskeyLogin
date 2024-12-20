
import { RouterOutlet } from '@angular/router';
import { WebAuthnService } from './service/auth.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [ FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  // Start the registration process
  email: string = '';
  modalText: string = 'status';
  

  constructor(private webAuthnService: WebAuthnService) {}

  async signup() {
    console.log('signup clicked');
    this.modalText = await this.webAuthnService.signup(this.email);
    console.log(this.modalText);
  }

  async login() {
    console.log('login clicked');
    this.modalText = await this.webAuthnService.login(this.email);
  }
}
