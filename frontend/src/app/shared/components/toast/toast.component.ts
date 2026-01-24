import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast toast-{{ toast.type }}">
          <div class="toast-content">
            <span class="toast-icon">
              @if (toast.type === 'success') {
                ✓
              } @else if (toast.type === 'error') {
                ✕
              } @else {
                ℹ
              }
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      pointer-events: none;
      width: 100%;
    }

    .toast {
      min-width: 300px;
      max-width: 400px;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
      display: flex;
      align-items: center;
      backdrop-filter: blur(10px);
      pointer-events: auto;
    }

    .toast-success {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
    }

    .toast-error {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
    }

    .toast-info {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .toast-icon {
      font-size: 20px;
      font-weight: bold;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-30px);
      }
    }
  `]
})
export class ToastComponent {
  @Input() toasts: Toast[] = [];
}
