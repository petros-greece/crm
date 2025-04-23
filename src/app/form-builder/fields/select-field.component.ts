import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatError
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'">
      <mat-label>{{ config.label }}</mat-label>
      <mat-select [formControl]="control">
        @for (opt of config.options || []; track opt.value) {
          <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
        }
      </mat-select>

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
        @if (control.hasError('min')) {
          <span>Minimum value is {{ control.getError('min').min }}</span>
        }
        @if (control.hasError('max')) {
          <span>Maximum value is {{ control.getError('max').max }}</span>
        }
      </mat-error>
    </mat-form-field>
  `
})
export class SelectFieldComponent extends BaseFieldComponent {}