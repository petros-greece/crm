import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-slider-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatIcon
  ],
  template: `
    <div class="flex flex-col gap-2 ml-3 w-full">
    <mat-label
        [ngStyle]="{
          color: control.invalid && (control.dirty || control.touched) ? '#ba1a1a' : ''
        }"
      >
      <mat-icon *ngIf="config.icon">
        {{ config.icon }}
      </mat-icon>
      {{ config.label }}
      <span *ngIf="config.required">*</span>
    </mat-label>
      
      <mat-slider
        [min]="config.validators?.min || 0"
        [max]="config.validators?.max || 100"
        [step]="config.step || 1"
        [displayWith]="config.formatLabel || formatLabel"
        discrete
      >
        <input matSliderThumb [formControl]="control" (valueChange)="markAsTouched()">
      </mat-slider>
      @if (showErrors()) {
        <mat-error class="text-xs">{{ config.label }} is required</mat-error>

        <div class="error-messages">
          @if (control.hasError('required')) {
            <mat-error>{{ config.label }} is required</mat-error>
          }
        </div>
      }
    </div>
  `,
})
export class SliderFieldComponent extends BaseFieldComponent {
  formatLabel(value: number): string {
    if (this.config?.formatLabel) {
      return this.config.formatLabel(value);
    }
    
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  markAsTouched() {
    console.log(this.control);
    if (!this.control.touched) {
      this.control.markAsTouched();
    }
    if (!this.control.dirty) {
      this.control.markAsDirty();
    }
  }

  showErrors(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }
}