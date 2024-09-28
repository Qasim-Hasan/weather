import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authService.isLoggedIn()) {
      // If the user is logged in, allow access to any route
      if (state.url === '/login') {
        // Redirect to homepage if already logged in and trying to access login page
        this.router.navigate(['/homepage']);
        return false; // Prevent access to the login page
      }
      return true; // Allow access to other routes
    } else {
      // User is not logged in
      if (state.url === '/login') {
        // Allow access to the login page for entering credentials
        return true;
      } else {
        // User is trying to access a route other than the login page
        // Log out the user (to ensure they are in a logged-out state)
        this.authService.logout(); // Log out user
        this.router.navigate(['/login']); // Redirect to login page
        return false; // Prevent access to the requested route
      }
    }
  }
}
