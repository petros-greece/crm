import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-autocomplete-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
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

      <!-- Autocomplete input field -->
      <input 
        matInput 
        [formControl]="control"
        [matAutocomplete]="auto"
      >

      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
        <mat-option *ngFor="let opt of filteredOptions" [value]="opt.value">
          {{ opt.label }}
        </mat-option>
      </mat-autocomplete>


      <!-- Error messages -->
      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        <ng-container *ngIf="control.hasError('required')">
          <span>{{ config.label }} is required</span>
        </ng-container>
        <ng-container *ngIf="control.hasError('minlength')">
          <span>Minimum length is {{ control.getError('minlength').requiredLength }}</span>
        </ng-container>
        <ng-container *ngIf="control.hasError('maxlength')">
          <span>Maximum length is {{ control.getError('maxlength').requiredLength }}</span>
        </ng-container>
        <ng-container *ngIf="control.hasError('pattern')">
          <span>Invalid format</span>
        </ng-container>
        <ng-container *ngIf="control.hasError('min')">
          <span>Minimum value is {{ control.getError('min').min }}</span>
        </ng-container>
        <ng-container *ngIf="control.hasError('max')">
          <span>Maximum value is {{ control.getError('max').max }}</span>
        </ng-container>
      </mat-error>
    </mat-form-field>
  `
})
export class AutocompleteFieldComponent extends BaseFieldComponent {
  filteredOptions: { label: string, value: any }[] = [];
  displayLabel = '';

  override ngOnInit() {
    this.setupInitialValue();
    this.setupFiltering(); // Add this line
  }

  // Add this method
  private setupFiltering() {
    this.control.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filterOptions(value);
      }
    });
  }

  private setupInitialValue() {
    const initialValue = this.control.value;
    if (initialValue) {
      const selectedOption = (this.config.options || [])
        .find(opt => opt.value === initialValue);
      this.displayLabel = selectedOption?.label || '';
    }

    this.control.valueChanges.subscribe(value => {
      const option = (this.config.options || [])
        .find(opt => opt.value === value);
      this.displayLabel = option?.label || '';
    });
  }


  displayFn = (value: any): string => {
    if (!value) return '';
    const option = (this.config.options || []).find(opt => opt.value === value);
    return option?.label || value;
  };

  filterOptions(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredOptions = (this.config.options || [])
      .filter(option => 
        option.label.toLowerCase().includes(filterValue)
      );
  }

  ngOnChanges() {
    // Update display when options change
    const currentValue = this.control.value;
    const selectedOption = (this.config.options || [])
      .find(opt => opt.value === currentValue);
    this.displayLabel = selectedOption?.label || '';
  }
}