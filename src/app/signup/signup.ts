
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signup(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const registered = this.authService.signup(
      this.name,
      this.email,
      this.password
    );

    if (!registered) {
      this.errorMessage = 'An account with this email already exists.';
      return;
    }

    this.successMessage = 'Account created successfully!';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
