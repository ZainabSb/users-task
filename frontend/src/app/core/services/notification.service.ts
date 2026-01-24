import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();
  private toastIdCounter = 0;

  showSuccess(message: string) {
    const toast: Toast = {
      id: this.toastIdCounter++,
      message: message,
      type: 'success'
    };
    this.toastSubject.next(toast);
    
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3000);
  }

  showError(message: string) {
    const toast: Toast = {
      id: this.toastIdCounter++,
      message: message,
      type: 'error'
    };
    this.toastSubject.next(toast);
    
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 4000);
  }

  showInfo(message: string) {
    const toast: Toast = {
      id: this.toastIdCounter++,
      message: message,
      type: 'info'
    };
    this.toastSubject.next(toast);
    
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3000);
  }

  private removeToast(id: number) {

  }
}