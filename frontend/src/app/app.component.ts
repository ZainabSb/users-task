import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UsersActions } from './store/users/users.actions';
import { selectUsers, selectUsersLoading, selectUsersError } from './store/users/users.selectors';
import { User } from './users.service';
import { ToastComponent, Toast } from './shared/components/toast/toast.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, ToastComponent, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  showUsersTable = false;
  showModal = false;
  users: User[] = [];
  toasts: Toast[] = [];
  showFullScreenLoading = false;
  private subscriptions = new Subscription();
  private previousUsersLength = 0;
  private isCreatingUser = false;

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    try {
      this.users$ = this.store.select(selectUsers);
      this.loading$ = this.store.select(selectUsersLoading);
      
      this.subscriptions.add(
        this.users$.subscribe(users => {
          this.users = users;
          this.cdr.detectChanges();
        })
      );

      this.subscriptions.add(
        combineLatest([this.users$, this.loading$]).pipe(
          filter(([users, loading]) => {
            return this.isCreatingUser && !loading && users.length > this.previousUsersLength;
          }),
          tap(() => {
            this.showFullScreenLoading = false;
            this.isCreatingUser = false;
            this.cdr.detectChanges();
            
            if (this.showUsersTable) {
              this.onShowUsers();
            }
          })
        ).subscribe(([users]) => {
          this.previousUsersLength = users.length;
        })
      );

      this.subscriptions.add(
        combineLatest([this.store.select(selectUsersError), this.loading$]).subscribe(([error, loading]) => {
          if (error && !loading && this.isCreatingUser && this.showFullScreenLoading) {
            this.showFullScreenLoading = false;
            this.isCreatingUser = false;
            this.cdr.detectChanges();
          }
        })
      );

      this.subscriptions.add(
        this.users$.subscribe(users => {
          this.previousUsersLength = users.length;
        })
      );

      this.subscriptions.add(
        this.notificationService.toast$.subscribe(toast => {
          this.toasts.push(toast);
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.toasts = this.toasts.filter(t => t.id !== toast.id);
            this.cdr.detectChanges();
          }, 3000);
        })
      );
    } catch (error) {
      console.error('Error initializing AppComponent:', error);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onShowUsers() {
    this.closeModal();
    this.showUsersTable = true;
    this.store.dispatch(UsersActions.loadUsers());
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
      this.notificationService.showError('Please fill in all required fields.');
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
      this.notificationService.showError('Please select a date of birth');
      return;
    }

    this.closeModal();
    this.isCreatingUser = true;
    this.showFullScreenLoading = true;
    this.cdr.detectChanges();

    this.store.dispatch(UsersActions.createUser({ userData: formData }));
  }
}