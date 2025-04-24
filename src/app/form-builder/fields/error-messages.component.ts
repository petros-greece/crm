// error-messages.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-error-messages',
  standalone: true,
  imports: [ MatError],
  template: `
  <div>

    @if (control?.invalid && (control?.dirty || control?.touched)) {
      @for (error of getErrors(); track error) {

        <mat-error>{{ error }}</mat-error>
      }
    }
  </div>
  `
})
export class ErrorMessagesComponent {
  @Input() control?: FormControl;
  @Input() label = 'This field';

  getErrors(): string[] {
    if (!this.control?.errors) return [];
    
    return Object.keys(this.control.errors).map(errorKey => {
      const error = this.control?.getError(errorKey);
      switch(errorKey) {
        case 'required': return `${this.label} is required`;
        case 'minlength': return `Minimum length is ${error.requiredLength}`;
        case 'maxlength': return `Maximum length is ${error.requiredLength}`;
        case 'pattern': return 'Invalid format';
        case 'min': return `Minimum value is ${error.min}`;
        case 'max': return `Maximum value is ${error.max}`;
        default: return `Validation error: ${errorKey}`;
      }
    });
  }
}