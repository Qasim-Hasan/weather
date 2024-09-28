import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
        // Check if already logged in and redirect to homepage
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/homepage']);
        }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        if (success) {
          console.log('Login successful'); // Log success

          this.router.navigate(['/homepage']); // Redirect to home or another page
        } else {
          console.log('Login failed, invalid credentials'); // Log invalid credentials case
          this.loginError = 'Invalid credentials. Please try again.';
        }
      },
      error => {
        console.error('Login failed due to error:', error); // Log the error message
        this.loginError = error; // Display the error message returned from the service
      }
    );
  }
}
