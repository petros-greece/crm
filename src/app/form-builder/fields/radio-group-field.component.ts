import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-radio-group-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIcon
  ],
  template: `
    <div class="flex flex-col gap-2">
      <mat-label
        class="ml-3"
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
      <mat-radio-group 
        [ngClass]="config.className || 'flex flex-col gap-2'"
        [formControl]="control"
        (change)="markAsTouched()"
      >
        @for (opt of config.options || []; track opt.value) {
          <mat-radio-button [value]="opt.value" class="radio-button">
            {{ opt.label }}
          </mat-radio-button>
        }
      </mat-radio-group>
      <div class="h-[30px]">
        @if (control.invalid && (control.dirty || control.touched)) {
          <mat-error>
            @if (control.hasError('required')) {
              <span class="text-xs ml-3">{{ config.label }} is required</span>
            }
          </mat-error>
        }
      </div>
    </div>
  `
})
export class RadioGroupFieldComponent extends BaseFieldComponent {
  markAsTouched() {
    if (!this.control.touched) {
      this.control.markAsTouched();
    }
    //console.log(this.control);
  }
}