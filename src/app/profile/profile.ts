
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: User | null = null;

  isEditing = false;

  name = '';
  email = '';

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.name = this.user.name;
      this.email = this.user.email;
    }
  }

  enableEdit(): void {
    this.loadProfile();
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile();
    this.errorMessage = '';
  }

  updateProfile(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim()) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const updated = this.authService.updateProfile(
      this.name.trim(),
      this.email.trim()
    );

    if (!updated) {
      this.errorMessage = 'Email already exists or profile could not be updated.';
      return;
    }

    this.loadProfile();
    this.isEditing = false;
    this.successMessage = 'Profile updated successfully!';
  }
}
