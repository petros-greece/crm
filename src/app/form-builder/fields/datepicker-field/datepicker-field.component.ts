import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
      
      <input matInput 
             [matDatepicker]="picker"
             [formControl]="formControl"
             [min]="config.minDate"
             [max]="config.maxDate">
      
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>

      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        <ng-container *ngIf="control.hasError('required')">
          {{ config.label }} is required
        </ng-container>
        <ng-container *ngIf="control.hasError('matDatepickerMin')">
          Minimum date is {{ control.getError('matDatepickerMin').min | date }}
        </ng-container>
        <ng-container *ngIf="control.hasError('matDatepickerMax')">
          Maximum date is {{ control.getError('matDatepickerMax').max | date }}
        </ng-container>
        <ng-container *ngIf="control.hasError('matDatepickerParse')">
          Invalid date format
        </ng-container>
      </mat-error>
    </mat-form-field>
  `
})
export class DatepickerFieldComponent extends BaseFieldComponent {

  get formControl(): FormControl {
    return this.control as FormControl;
  }
  // Add additional date validation if needed
  override ngOnInit() {
    // Add min/max validators for datepicker
    if (this.config.minDate) {
      this.formControl.addValidators(this.minDateValidator(this.config.minDate));
    }
    if (this.config.maxDate) {
      this.formControl.addValidators(this.maxDateValidator(this.config.maxDate));
    }
  }


  private minDateValidator(min: Date): ValidatorFn {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      return value && min && value < min
        ? { matDatepickerMin: { min, actual: value } }
        : null;
    };
  }

  private maxDateValidator(max: Date): ValidatorFn {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      return value && max && value > max
        ? { matDatepickerMax: { max, actual: value } }
        : null;
    };
  }
}