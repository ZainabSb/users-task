import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface User {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  username?: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  users: User[] = [];
  showUsersTable = false;
  showModal = false;
  isLoading = false;

  firstName = '';
  lastName = '';
  dateOfBirth = '';
  username = '';
  password = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async onShowUsers() {
    this.closeModal();
    this.showUsersTable = true;
    this.isLoading = true;
    this.users = [];
    this.cdr.detectChanges(); 

    try {
      const response = await fetch('http://localhost:3000/users/list');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.users = Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      this.users = [];
      alert('Error loading users. Make sure the backend server is running on port 3000.');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); 
    }
  }

  onNewUser() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  onModalOverlayClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = '';
    this.username = '';
    this.password = '';
  }

  async onSubmit() {
    if (!this.dateOfBirth.trim()) {
      alert('Please select a date of birth');
      return;
    }

    const formData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      dateOfBirth: this.dateOfBirth.trim(),
      username: this.username.trim(),
      password: this.password
    };

    try {
      const response = await fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('User created successfully!');
        this.closeModal();
        if (this.showUsersTable) {
          await this.onShowUsers();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert('Error creating user: ' + (errorData.message || 'Failed to create user'));
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert('Error creating user: ' + (error.message || 'Unknown error'));
    }
  }
}
