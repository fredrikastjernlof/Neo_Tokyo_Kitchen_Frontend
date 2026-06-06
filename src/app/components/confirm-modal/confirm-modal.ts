import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  //Input properties
  title = input.required<string>();
  message = input.required<string>();

  confirmText = input('Ja, ta bort');
  cancelText = input('Avbryt');
  warningText = input('Detta går inte att ångra.');
  isLoading = input(false);

  // Output events
  confirm = output<void>();
  cancel = output<void>();
}