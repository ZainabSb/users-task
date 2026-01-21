import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService, User } from './users.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  users: User[] = [];
  showUsersTable = false;
  showModal = false;
  isLoading = false;

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  onShowUsers() {
    this.closeModal();
    this.showUsersTable = true;
    this.isLoading = true;
    this.users = [];
    this.cdr.detectChanges(); 

    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.users = [];
        this.isLoading = false;
        this.cdr.detectChanges(); 
        alert('Error loading users. Make sure the backend server is running on port 3000.');
      }
    });
  }

  onNewUser() {
    this.showModal = true;
    this.resetForm();
    this.cdr.detectChanges();
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
    this.userForm.reset();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formValue = this.userForm.value;
    const formData = {
      firstName: formValue.firstName?.trim() || '',
      lastName: formValue.lastName?.trim() || '',
      dateOfBirth: formValue.dateOfBirth?.trim() || '',
      username: formValue.username?.trim() || '',
      password: formValue.password || ''
    };

    if (!formData.dateOfBirth) {
      alert('Please select a date of birth');
      return;
    }

    this.usersService.createUser(formData).subscribe({
      next: () => {
        alert('User created successfully!');
        this.closeModal();
        if (this.showUsersTable) this.onShowUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to create user';
        alert('Error creating user: ' + errorMessage);
      }
    });
  }
}
