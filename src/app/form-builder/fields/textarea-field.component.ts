import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
   MatIcon
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
      <mat-label>
        <mat-icon *ngIf="config.icon">
          {{ config.icon }}
        </mat-icon>
        {{ config.label }}
      </mat-label>
      
      <textarea
        matInput
        [formControl]="control"
        [type]="config.type || 'text'"
        [placeholder]="config.placeholder || ''"
        [autocomplete]="config.autocomplete || 'off'"
        [rows]="config.rows || 5"
      ></textarea>

      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        @if (control.hasError('required')) {
          <span>{{ config.label }} is required</span>
        }
        @if (control.hasError('minlength')) {
          <span>Minimum length is {{ control.getError('minlength').requiredLength }}</span>
        }
        @if (control.hasError('maxlength')) {
          <span>Maximum length is {{ control.getError('maxlength').requiredLength }}</span>
        }
        @if (control.hasError('pattern')) {
          <span>Invalid format</span>
        }
      </mat-error>
    </mat-form-field>
  `
})
export class TextareaFieldComponent extends BaseFieldComponent {}