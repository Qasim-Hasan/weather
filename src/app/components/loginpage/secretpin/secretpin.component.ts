import { Component, Output, EventEmitter , SecurityContext } from '@angular/core';
import { PinGuard } from '../../../guards/pin.guard';  // Import PinGuard
import {environment} from '../../../../environments/environment'
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-secretpin',
  templateUrl: './secretpin.component.html',
  styleUrls: ['./secretpin.component.css']
})
export class SecretPinComponent {
  enteredPin: string = '';  // Pin entered by the user
  errorMessage: string = '';  // Error message for invalid PIN

  @Output() pinVerified = new EventEmitter<boolean>();  // Emit event when PIN is verified

  constructor(private sanitizer: DomSanitizer) {}

  onSubmit() {
    // Sanitize any user input or HTML (if applicable)
    const sanitizedPin = this.sanitizer.sanitize(SecurityContext.HTML, this.enteredPin);

    if (sanitizedPin === environment.secretPin) {
      this.pinVerified.emit(true);  // Emit true if PIN matches
    } else {
      this.errorMessage = 'Incorrect PIN. Please try again.';  // Show error if PIN doesn't match
      this.pinVerified.emit(false);  // Emit false if PIN doesn't match (optional)
    }
  }
}
