import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UsersActions } from './store/users/users.actions';
import { selectUsers, selectUsersLoading } from './store/users/users.selectors';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { palette, updatePreset } from '@primeuix/themes';

@Component({
  selector: 'app-root',
  standalone: true,
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
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;

  showUsersTable = false;
  showModal = false;

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
    private notificationService: NotificationService
  ) {
    this.users$ = this.store.select(selectUsers);
    this.loading$ = this.store.select(selectUsersLoading);

    this.subscriptions.add(
      this.loading$.subscribe(loading => {
        if (this.isCreatingUser && !loading) {
          this.showFullScreenLoading = false;
          this.isCreatingUser = false;
        }
      })
    );

    this.subscriptions.add(
      this.notificationService.toast$.subscribe(toast => {
        this.toasts.push(toast);

        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== toast.id);
        }, 3000);
      })
    );
  }

  ngOnInit() {
    const storedDark = localStorage.getItem(this.DARK_MODE_STORAGE_KEY);
    this.darkMode = storedDark === 'true';
    document.documentElement.classList.toggle('app-dark', this.darkMode);

    const storedColor = localStorage.getItem(this.PRIMARY_COLOR_STORAGE_KEY);
    if (storedColor) {
      this.primaryColor = storedColor;
    }

    this.applyPrimaryColor(this.primaryColor);
  }

  applyDarkMode(checked: boolean) {
    this.darkMode = checked;
    document.documentElement.classList.toggle('app-dark', checked);
    localStorage.setItem(this.DARK_MODE_STORAGE_KEY, String(checked));
  }

  onPrimaryColorChange(value: string | object) {
    const hex = typeof value === 'string' ? value : this.toHex(value);
    if (!hex) return;

    this.primaryColor = hex;
    this.applyPrimaryColor(hex);
  }

  private applyPrimaryColor(hex: string) {
    const p = palette(hex);

    updatePreset({
      semantic: {
        primary: p as any
      }
    });

    localStorage.setItem(this.PRIMARY_COLOR_STORAGE_KEY, hex);
  }

  private toHex(value: unknown): string | null {
    if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
      const r = (value as { r: number }).r;
      const g = (value as { g: number }).g;
      const b = (value as { b: number }).b;
      return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
    }
    return null;
  }

  onShowUsers() {
    this.closeModal();
    this.showUsersTable = true;
    this.store.dispatch(UsersActions.loadUsers());
  }

  onNewUser() {
    this.showModal = true;
    this.resetForm();
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

    if (!dateOfBirthStr) {
      this.notificationService.showError('Please select a date of birth');
      return;
    }

    const formData = {
      firstName: formValue.firstName?.trim() || '',
      lastName: formValue.lastName?.trim() || '',
      dateOfBirth: dateOfBirthStr,
      username: formValue.username?.trim() || '',
      password: formValue.password || ''
    };

    this.closeModal();
    this.isCreatingUser = true;
    this.showFullScreenLoading = true;

    this.store.dispatch(UsersActions.createUser({ userData: formData }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
