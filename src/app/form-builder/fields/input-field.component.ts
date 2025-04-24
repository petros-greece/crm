import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
      <mat-label>{{ config.label }}</mat-label>
      
      <input
        matInput
        [formControl]="control"
        [type]="config.type || 'text'"
        [placeholder]="config.placeholder || ''"
        [autocomplete]="config.autocomplete || 'off'"
        [min]="config.validators?.min"
        [max]="config.validators?.max"
        [step]="config.step"
      >

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
        <!-- @if (control.hasError('email')) {
          <span>Please enter a valid email address</span>
        } -->
      </mat-error>
    </mat-form-field>
  `
})
export class InputFieldComponent extends BaseFieldComponent {}