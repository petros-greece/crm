import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Observable, distinctUntilChanged, of, from, isObservable, merge, Subscription, switchMap, takeUntil, Subject } from 'rxjs';

/** option shape */
interface Option { label: string; value: any; }

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <mat-form-field [appearance]="config.appearance || 'fill'" class="w-full">
      <mat-label>
        <mat-icon *ngIf="config.icon">{{ config.icon }}</mat-icon>
        {{ config.label }}
      </mat-label>
      
      <mat-select [formControl]="control" [multiple]="config.multiple" class="w-full">
        <mat-option 
          *ngFor="let opt of options$ | async; trackBy: trackByValue" 
          [value]="opt.value">
          {{ opt.label }}
        </mat-option>
      </mat-select>

      <mat-error *ngIf="control.invalid && (control.dirty || control.touched)">
        <span *ngIf="control.hasError('required')">
          {{ config.label }} is required
        </span>
      </mat-error>
    </mat-form-field>
  `
})
export class SelectFieldComponent extends BaseFieldComponent implements OnDestroy {
  options$!: Observable<Option[]>;
  private optionsSub!: Subscription;

  override ngOnInit() {
    super.ngOnInit();
    
    // Initialize options stream
    this.options$ = this.createOptionsStream();
    
    // Handle dynamic disabling
    this.optionsSub = this.options$.subscribe(options => {
      this.updateControlState(options);
    });
  }

  private createOptionsStream(): Observable<Option[]> {
    if (this.config.options) {
      return of(this.config.options);
    }
    if (this.config.dynamicOptions) {
      if (isObservable(this.config.dynamicOptions)) {
        return this.config.dynamicOptions;
      }
      if (typeof this.config.dynamicOptions === 'function') {
        return from(this.config.dynamicOptions());
      }
    }
    return of([]);
  }

  private updateControlState(options: Option[]): void {
    const shouldDisable = this.shouldDisable(options);
    
    if (shouldDisable && this.control.enabled) {
      this.control.disable({ emitEvent: false });
    } else if (!shouldDisable && this.control.disabled) {
      this.control.enable({ emitEvent: false });
    }
  }

  private shouldDisable(options: Option[]): boolean {
    // Disable if configured or no options available
    return !!this.config.disabled || options.length === 0;
  }

  ngOnDestroy() {
    this.optionsSub?.unsubscribe();
  }


  trackByValue(_: number, o: Option) {
    return o.value;
  }
}
