
import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[] = JSON.parse(
    localStorage.getItem('peoplehub_users') || '[]'
  );

  private currentUser: User | null = JSON.parse(
    localStorage.getItem('peoplehub_current_user') || 'null'
  );

  signup(name: string, email: string, password: string): boolean {

    const existingUser = this.users.find(
      user => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      password
    };

    this.users.push(newUser);

    localStorage.setItem(
      'peoplehub_users',
      JSON.stringify(this.users)
    );

    return true;
  }

  login(email: string, password: string): boolean {

    const user = this.users.find(
      user =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!user) {
      return false;
    }

    this.currentUser = user;

    localStorage.setItem(
      'peoplehub_current_user',
      JSON.stringify(user)
    );

    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('peoplehub_current_user');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  updateProfile(name: string, email: string): boolean {

    if (!this.currentUser) {
      return false;
    }

    const emailExists = this.users.find(
      user =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.id !== this.currentUser!.id
    );

    if (emailExists) {
      return false;
    }

    const index = this.users.findIndex(
      user => user.id === this.currentUser!.id
    );

    if (index === -1) {
      return false;
    }

    this.users[index].name = name.trim();
    this.users[index].email = email.trim();

    this.currentUser = this.users[index];

    localStorage.setItem(
      'peoplehub_users',
      JSON.stringify(this.users)
    );

    localStorage.setItem(
      'peoplehub_current_user',
      JSON.stringify(this.currentUser)
    );

    return true;
  }
}
