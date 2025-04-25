import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-date-range-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
      <mat-label>
        <mat-icon *ngIf="config.icon">{{ config.icon }}</mat-icon>
        {{ config.label || 'Select date range' }}
      </mat-label>

      <mat-date-range-input [rangePicker]="picker" [formGroup]="control">
        <input matStartDate formControlName="start" 
               [min]="config.minDate" 
               [max]="config.maxDate || control.value?.end"
               placeholder="Start date" 
               required>
        <input matEndDate formControlName="end" 
               [min]="config.minDate || control.value?.start" 
               [max]="config.maxDate"
               placeholder="End date" 
               required>
      </mat-date-range-input>

      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>

      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        <!-- Individual control errors -->
        <ng-container *ngIf="startControl?.hasError('required') || endControl?.hasError('required')">
          Both dates are required
        </ng-container>
        
        <ng-container *ngIf="startControl?.hasError('matDatepickerMin')">
          Start date cannot be before {{ startControl.getError('matDatepickerMin').min | date }}
        </ng-container>
        
        <ng-container *ngIf="startControl?.hasError('matDatepickerMax')">
          Start date cannot be after {{ startControl.getError('matDatepickerMax').max | date }}
        </ng-container>
        
        <ng-container *ngIf="endControl?.hasError('matDatepickerMin')">
          End date cannot be before {{ endControl.getError('matDatepickerMin').min | date }}
        </ng-container>
        
        <ng-container *ngIf="endControl?.hasError('matDatepickerMax')">
          End date cannot be after {{ endControl.getError('matDatepickerMax').max | date }}
        </ng-container>

        <!-- Group errors -->
        <ng-container *ngIf="control.hasError('endBeforeStart')">
          End date must be after start date
        </ng-container>
        
        <ng-container *ngIf="control.hasError('invalidDates')">
          Please enter valid dates
        </ng-container>
      </mat-error>
    </mat-form-field>
  `
})
export class DateRangeFieldComponent extends BaseFieldComponent<FormGroup> implements OnInit {
  private destroyRef = inject(DestroyRef);
  startControl!: FormControl;
  endControl!: FormControl;

  override ngOnInit(): void {
    super.ngOnInit();

    if (!(this.control instanceof FormGroup)) {
      throw new Error('DateRangeFieldComponent requires a FormGroup control');
    }

    // Initialize controls
    this.startControl = this.control.get('start') as FormControl || new FormControl(null);
    this.endControl = this.control.get('end') as FormControl || new FormControl(null);

    // Add controls if missing
    if (!this.control.contains('start')) this.control.addControl('start', this.startControl);
    if (!this.control.contains('end')) this.control.addControl('end', this.endControl);

    // Set up validators
    this.setupValidators();
    this.setupCrossValidation();
  }

  private setupValidators(): void {
    // Required validators
    if (this.config.required) {
      this.startControl.addValidators(Validators.required);
      this.endControl.addValidators(Validators.required);
    }

    // Update validity when dates change
    this.control.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.control.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setupCrossValidation(): void {
    const validator = (group: AbstractControl) => {
      const start = group.get('start')?.value;
      const end = group.get('end')?.value;

      if (!start || !end) return null;

      const errors: any = {};

      // End before start validation
      if (new Date(end) < new Date(start)) {
        errors['endBeforeStart'] = true;
      }

      // Date validity check
      if (isNaN(new Date(start).getTime())) {
        errors['invalidDates'] = true;
      }
      if (isNaN(new Date(end).getTime())) errors['invalidDates'] = true;

      return Object.keys(errors).length ? errors : null;
    };

    this.control.addValidators(validator);
  }
}