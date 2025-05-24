import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, take } from 'rxjs';

@Component({
  selector: 'app-autocomplete-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="optionSelected($event)">
        <mat-option *ngFor="let opt of filteredOptions" [value]="opt.value">
          {{ opt.label }}
        </mat-option>
      </mat-autocomplete>


      <!-- Error messages -->
      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        <ng-container *ngIf="control.hasError('required')">
          <span>{{ config.label }} is required</span>
        </ng-container>
      </mat-error>
    </mat-form-field>
  `
})
export class AutocompleteFieldComponent extends BaseFieldComponent {
  filteredOptions: { label: string, value: any }[] = [];
  displayLabel = '';
  private optionsSubject = new BehaviorSubject<any[]>([]); // Add this

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  override ngOnInit() {
    this.filteredOptions = [...(this.config.options || [])];
    this.initializeOptions();
    this.setupInitialValue();
    this.setupFiltering();
  }

  optionSelected(e: any) {
    console.log(e)
  }

  private initializeOptions() {
    if (this.config.options) {
      this.optionsSubject.next(this.config.options);
    }

    if (this.config.dynamicOptions instanceof Observable) {
      this.config.dynamicOptions.subscribe(opts => {
        this.optionsSubject.next(opts);
        this.filterOptions(this.control.value || ''); // Re-filter with new options
      });
    }
    else if (typeof this.config.dynamicOptions === 'function') {
      this.config.dynamicOptions().then(opts => {
        this.optionsSubject.next(opts);
        this.filterOptions(this.control.value || '');
      });
    }
  }

  private setupFiltering() {
    this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (typeof value === 'string') {
        this.filterOptions(value);
      }
      this.cdr.markForCheck();
    });
  }

  private setupInitialValue() {
    const initialValue = this.control.value;
    if (initialValue) {
      this.optionsSubject.pipe(take(1)).subscribe(options => {
        const selectedOption = options.find(opt => opt.value === initialValue);
        this.displayLabel = selectedOption?.label || '';
        this.cdr.markForCheck();
      });
    }

    this.control.valueChanges.subscribe(value => {
      this.optionsSubject.pipe(take(1)).subscribe(options => {
        const option = options.find(opt => opt.value === value);
        this.displayLabel = option?.label || '';
        this.cdr.markForCheck();
      });
    });
  }


  displayFn = (value: any): string => {
    if (!value) return '';
    const option = this.filteredOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  filterOptions(value: string) {
    const filterValue = value.toLowerCase();
    this.optionsSubject.pipe(take(1)).subscribe(options => {
      this.filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(filterValue)
      );
      this.cdr.markForCheck();
    });
  }

  ngOnChanges() {
    this.optionsSubject.pipe(take(1)).subscribe(options => {
      const currentValue = this.control.value;
      const selectedOption = options.find(opt => opt.value === currentValue);
      this.displayLabel = selectedOption?.label || '';
      this.cdr.markForCheck();
    });
  }

}