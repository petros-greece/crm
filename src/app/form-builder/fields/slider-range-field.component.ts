import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { BaseFieldComponent } from './base-field.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-slider-range-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatInputModule,
    MatIcon
  ],
  template: `
    <div [formGroup]="control" class="flex flex-col gap-2 w-full">
      <label>
        <mat-icon *ngIf="config.icon">
          {{ config.icon }}
        </mat-icon>
        {{ config.label || 'Select a range' }}
      </label>

      <mat-slider
        [min]="config.validators?.min || 0"
        [max]="config.validators?.max || 100"
        [step]="config.step || 1"
        thumbLabel
        tickInterval="1">
        <input value="20" matSliderStartThumb [formControl]="getFormControl('start')" >
        <input value="80" matSliderEndThumb [formControl]="getFormControl('end')" >
      </mat-slider>


    </div>
  `,

})
export class SliderRangeFieldComponent extends BaseFieldComponent<FormGroup> implements OnInit {

  override ngOnInit(): void {
    super.ngOnInit();

    if (!(this.control instanceof FormGroup)) {
      throw new Error('The control must be a FormGroup for a slider range field');
    }

    if (!this.control.get('start')) {
      this.control.addControl('start', new FormControl(this.config.validators?.min || 0));
    }

    if (!this.control.get('end')) {
      this.control.addControl('end', new FormControl(this.config.validators?.max || 100));
    }
  }

  onSliderInput(event: any): void {
    const value = event.value;
    this.control.get('start')?.setValue(value);
  }

  onInputChange(field: string, value: any): void {
    const numValue = Number(value);
    this.control.get(field)?.setValue(numValue);
  }

  getFormControl(name: string): FormControl {
    const ctrl = this.control.get(name);
    if (!(ctrl instanceof FormControl)) {
      throw new Error(`${name} is not a FormControl`);
    }
    return ctrl;
  }
}
