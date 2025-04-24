import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'app-date-range-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatIcon
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
      <mat-label>
      <mat-icon *ngIf="config.icon">
          {{ config.icon }}
        </mat-icon>
        {{ config.label || 'Enter a date range' }}
      </mat-label>
      
      <mat-date-range-input 
        [formGroup]="control" 
        [rangePicker]="picker">
        
        <input matStartDate placeholder="Start date" formControlName="start">
        <input matEndDate placeholder="End date" formControlName="end">
        
      </mat-date-range-input>

      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `
})
export class DateRangeFieldComponent extends BaseFieldComponent<FormGroup> {
  override ngOnInit(): void {
    super.ngOnInit();
    
    // Ensure that this.control is a FormGroup
    if (!(this.control instanceof FormGroup)) {
      throw new Error('The control must be a FormGroup for a date range field');
    }
    
    // If 'start' and 'end' controls do not exist in the FormGroup, we add them
    if (!this.control.get('start')) {
      this.control.addControl('start', new FormControl(null));
    }
    if (!this.control.get('end')) {
      this.control.addControl('end', new FormControl(null));
    }
  }
}
