import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  constructor(private router: Router) {}

  navigateToBodyPage() {
    this.router.navigate(['/homepage']);
  }
}
