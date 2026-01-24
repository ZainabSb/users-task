import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container">
      <div class="spinner">
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
      </div>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px;
    }

    .spinner {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .spinner-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4CAF50 0%, #2196F3 100%);
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .spinner-circle:nth-child(1) {
      animation-delay: -0.32s;
    }

    .spinner-circle:nth-child(2) {
      animation-delay: -0.16s;
    }

    .spinner-circle:nth-child(3) {
      animation-delay: 0s;
    }

    .spinner-message {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = '';
}
