import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { BehaviorSubject, Observable, Subject, from, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-autocomplete-chips',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatOptionModule,
    MatIcon
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
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

      <mat-chip-grid #chipGrid>
        <mat-chip-row *ngFor="let item of selectedItems; trackBy: trackByValue" (removed)="remove(item)">
          {{ getLabel(item) }}
          <button matChipRemove>
            <mat-icon>cancel</mat-icon>
          </button>
        </mat-chip-row>

        <input
          matInput
          [formControl]="searchControl"
          [matAutocomplete]="auto"
          [matChipInputFor]="chipGrid"
          (matChipInputTokenEnd)="add($event)"
          (keydown.enter)="onEnter($event)"
        >
      </mat-chip-grid>

      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
        <mat-option *ngFor="let opt of filteredOptions; trackBy: trackByValue" [value]="opt.value">
          {{ opt.label }}
        </mat-option>
      </mat-autocomplete>

      <mat-hint *ngIf="control.invalid && (control.dirty || control.touched)" style="color:#ba1a1a;">
        @if (control.hasError('required')) {
          <span>{{ config.label }} is required</span>
        }
      </mat-hint>
    </mat-form-field>
  `
})
export class AutocompleteChipFieldComponent extends BaseFieldComponent implements OnDestroy {
  searchControl = new FormControl('');
  filteredOptions: { label: string, value: any }[] = [];
  selectedItems: any[] = [];
  private optionsSubject = new BehaviorSubject<{ label: string, value: any }[]>([]);
  private destroy$ = new Subject<void>();

  override ngOnInit() {
    this.initializeOptions();
    this.setupFiltering();
    this.syncInitialValues();
    this.setupStateSync();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeOptions() {
    const staticOptions = this.config.options || [];
    this.optionsSubject.next(staticOptions);

    if (this.config.dynamicOptions) {
      const dynamic$ = this.config.dynamicOptions instanceof Observable 
        ? this.config.dynamicOptions 
        : from(this.config.dynamicOptions());

      dynamic$.pipe(takeUntil(this.destroy$)).subscribe(opts => {
        const combined = [...staticOptions, ...opts];
        this.optionsSubject.next(combined);
        this.filterOptions(this.searchControl.value || '');
      });
    }
  }

  private setupStateSync() {
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.control.touched) this.control.markAsTouched();
    });

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.control.dirty) this.control.markAsDirty();
    });
  }

  private setupFiltering() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.filterOptions(value || '');
    });
  }

  private syncInitialValues() {
    if (this.control.value) {
      this.selectedItems = Array.isArray(this.control.value)
        ? [...this.control.value]
        : [this.control.value];
    }
  }

  filterOptions(value: string) {
    const filterValue = value.toLowerCase();
    const options = this.optionsSubject.getValue();
    
    this.filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(filterValue) &&
      !this.selectedItems.includes(option.value)
    );
    
    // Trigger change detection
    this.filteredOptions = [...this.filteredOptions];
  }

  getLabel(value: any): string {
    const options = this.optionsSubject.getValue();
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  }

  trackByValue(index: number, item: any): any {
    return item.value;
  }

  selected(event: any) {
    const value = event.option.value;
    if (!this.selectedItems.includes(value)) {
      this.selectedItems = [...this.selectedItems, value];
      this.control.setValue(this.selectedItems);
    }
    this.searchControl.setValue('');
  }

  remove(item: any) {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.control.setValue(this.selectedItems);
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (!value) return;

    const options = this.optionsSubject.getValue();
    const option = options.find(opt =>
      opt.label === value || opt.value === value
    );

    const newValue = option ? option.value : value;

    if (!this.selectedItems.includes(newValue)) {
      this.selectedItems = [...this.selectedItems, newValue];
      this.control.setValue(this.selectedItems);
    }

    if (event.input) {
      event.input.value = '';
    }
    this.searchControl.setValue('');
  }

  onEnter(event: Event) {
    event.preventDefault();
    const value = (this.searchControl.value || '').trim();
    if (!value) return;

    const options = this.optionsSubject.getValue();
    const option = options.find(opt =>
      opt.label === value || opt.value === value
    );

    const newValue = option ? option.value : value;

    if (!this.selectedItems.includes(newValue)) {
      this.selectedItems = [...this.selectedItems, newValue];
      this.control.setValue(this.selectedItems);
    }

    this.searchControl.setValue('');
  }
}