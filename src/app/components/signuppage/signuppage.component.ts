import { Component } from '@angular/core';
import { SignupService, AdminCreate } from '../../services/signup/signup.service'; // Adjust path as necessary
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent {
  admin: AdminCreate = {
    username: '',
    password: '',
    email: ''
  };
  isLoading: boolean = false;  // To track the loading state
  confirmPassword: string = ''; // Add confirm password property

  constructor(
    private signupService: SignupService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  onSubmit() {
    if (this.admin.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Set loading state to true before starting the signup process
    this.isLoading = true;

    this.signupService.createAdmin(this.admin).subscribe(
      response => {
        console.log('Admin created successfully', response);
        this.snackBar.open('Admin created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
        this.isLoading = false; // Hide spinner after successful signup
      },
      error => {
        this.isLoading = false; // Hide spinner after an error occurs
        if (error.status === 400 && error.error.detail === "Username already exists") {
          this.snackBar.open('Username already exists. Choose a different one.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          console.error('Error creating admin', error);
          this.snackBar.open('Error creating admin. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      }
    );
  }


}

