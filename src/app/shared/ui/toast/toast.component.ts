import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ToastService, Toast } from '../../data-access/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private toastService = inject(ToastService);
  public toasts = this.toastService.toasts$; // Renamed from toasts$ to toasts

  // OnInit, OnDestroy, and timeouts map are removed.
  // The ToastService's push method already handles setTimeout for auto-dismissal.

  dismiss(id: string): void {
    this.toastService.dismiss(id);
    // No need to manage timeouts here anymore as the service handles it.
    // If a toast is manually dismissed, its timeout in the service will eventually
    // try to dismiss a non-existent toast, which is harmless.
  }
}
