import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '../../environments/environment';  // Import secretPin from environment

@Injectable({
  providedIn: 'root'
})
export class PinGuard implements CanActivate {

  private enteredPin: string | null = null;  // Store the entered PIN to compare later

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // Check if the entered PIN matches the secret PIN stored in the environment
    if (this.enteredPin === environment.secretPin) {
      return true;  // Allow access if the PIN matches
    } else {
      // If the PIN does not match, redirect to login or show error
      this.router.navigate(['/login']);  // Redirect to login or another page
      return false;
    }
  }

  // Set the entered PIN when verified (this is triggered by the modal)
  setPin(enteredPin: string) {
    this.enteredPin = enteredPin;
  }
}
