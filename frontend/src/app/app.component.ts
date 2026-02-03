import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UsersActions } from './store/users/users.actions';
import { selectUsers, selectUsersLoading, selectUsersError } from './store/users/users.selectors';
import { User } from './users.service';
import { ToastComponent, Toast } from './shared/components/toast/toast.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from './core/services/notification.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { PasswordModule } from 'primeng/password';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastComponent,
    LoadingSpinnerComponent,
    ButtonModule,
    RippleModule,
    DialogModule,
    TableModule,
    InputTextModule,
    DatePickerModule,
    PasswordModule,
    ToggleSwitchModule,
    SelectButtonModule,
    ColorPickerModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  showUsersTable = false;
  showModal = false;
  users: User[] = [];
  toasts: Toast[] = [];
  showFullScreenLoading = false;
  darkMode = false;
  private readonly DARK_MODE_STORAGE_KEY = 'app-dark-mode';
  primaryColor = '#10b981';
  private readonly PRIMARY_COLOR_STORAGE_KEY = 'app-primary-color';
  tableSizes = [
    { name: 'Small', value: 'small' },
    { name: 'Normal', value: 'normal' },
    { name: 'Large', value: 'large' }
  ];
  selectedTableSize: 'small' | 'normal' | 'large' = 'normal';
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

  ngOnInit() {
    const stored = localStorage.getItem(this.DARK_MODE_STORAGE_KEY);
    this.darkMode = stored === 'true';
    document.documentElement.classList.toggle('app-dark', this.darkMode);
    const storedColor = localStorage.getItem(this.PRIMARY_COLOR_STORAGE_KEY);
    if (storedColor) {
      this.primaryColor = storedColor;
      this.applyPrimaryColor(storedColor);
    }
  }

  onPrimaryColorChange(value: string | object) {
    const hex = typeof value === 'string' ? value : this.toHex(value);
    if (hex) {
      this.primaryColor = hex;
      this.applyPrimaryColor(hex);
    }
  }

  //here am definig the main color and hover colors 
  applyPrimaryColor(hex: string) {
    const root = document.documentElement.style;
    const hoverHex = this.darkenHex(hex, 0.15);
    const activeHex = this.darkenHex(hex, 0.25);
    const lightHex = this.lightenHex(hex, 0.15);
    root.setProperty('--p-primary-500', hex);
    root.setProperty('--p-primary-color', hex);
    root.setProperty('--p-primary-400', lightHex);
    root.setProperty('--p-primary-600', hoverHex);
    root.setProperty('--p-primary-700', activeHex);
    root.setProperty('--p-primary-hover-color', hoverHex);
    root.setProperty('--p-primary-active-color', activeHex);
    root.setProperty('--p-focus-ring-color', hex);
    root.setProperty('--p-green-500', hex);
    root.setProperty('--p-green-600', hoverHex);
    root.setProperty('--p-green-700', activeHex);
    root.setProperty('--p-green-400', lightHex);
    root.setProperty('--p-green-hover-color', lightHex);
    localStorage.setItem(this.PRIMARY_COLOR_STORAGE_KEY, hex);
  }

  private toHex(value: unknown): string | null {
    if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
      const r = (value as { r: number }).r;
      const g = (value as { g: number }).g;
      const b = (value as { b: number }).b;
      return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
    }
    return null;
  }

  private lightenHex(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
    const b = Math.min(255, (num & 0xff) + 255 * amount);
    return '#' + (0x1000000 + (r << 16) + (g << 8) + (b | 0)).toString(16).slice(1);
  }

  private darkenHex(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
    const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
    const b = Math.max(0, (num & 0xff) * (1 - amount));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + (b | 0)).toString(16).slice(1);
  }

  applyDarkMode(checked: boolean) {
    this.darkMode = checked;
    document.documentElement.classList.toggle('app-dark', checked);
    localStorage.setItem(this.DARK_MODE_STORAGE_KEY, String(checked));
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

  onDialogVisibleChange(visible: boolean) {
    if (!visible) {
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
    const rawDate = formValue.dateOfBirth as string | Date | null | undefined;
    const dateOfBirthStr =
      typeof rawDate === 'string'
        ? rawDate.trim()
        : rawDate instanceof Date
          ? rawDate.toISOString().slice(0, 10)
          : '';

    const formData = {
      firstName: formValue.firstName?.trim() || '',
      lastName: formValue.lastName?.trim() || '',
      dateOfBirth: dateOfBirthStr,
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