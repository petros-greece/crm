import { Component, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  AbstractControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { InputFieldComponent } from './input-field.component';
import { SelectFieldComponent } from './select-field.component';
import { DatepickerFieldComponent } from './datepicker-field.component';

@Component({
  selector: 'app-group-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    InputFieldComponent,
    SelectFieldComponent,
    DatepickerFieldComponent
  ],
  template: `
    <fieldset class="border p-4 rounded">
      <legend class="px-2 font-semibold">{{ config.label }}</legend>
      <div class="grid gap-4" [style.gridTemplateColumns]="gridColumns">
        <ng-container *ngFor="let field of config.fields">
          <ng-container [ngSwitch]="field.type">
            <app-input-field
              *ngSwitchCase="'text'"
              [config]="field"
              [control]="getFormControl(field.name)">
            </app-input-field>

            <app-select-field
              *ngSwitchCase="'select'"
              [config]="field"
              [control]="getFormControl(field.name)">
            </app-select-field>

            <app-date-field
              *ngSwitchCase="'date'"
              [config]="field"
              [control]="getFormControl(field.name)">
            </app-date-field>

            <!-- add more field types here as needed -->
          </ng-container>
        </ng-container>
      </div>
    </fieldset>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupFieldComponent),
    multi: true
  }]
})
export class GroupFieldComponent
  extends BaseFieldComponent<FormGroup>
  implements ControlValueAccessor, OnInit
{
  /** Alias for the FormGroup passed in as `control` */
  get groupControl(): FormGroup {
    return this.control;
  }

  /** ControlValueAccessor: set form value */
  writeValue(value: any): void {
    this.groupControl.patchValue(value ?? {});
  }

  /** ControlValueAccessor: propagate changes */
  registerOnChange(fn: any): void {
    this.groupControl.valueChanges.subscribe(fn);
  }

  /** ControlValueAccessor: mark touched */
  registerOnTouched(fn: any): void {
    // you could subscribe to statusChanges or implement blur handling
  }

  /** ControlValueAccessor: enable/disable */
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.groupControl.disable() : this.groupControl.enable();
  }

  /** Build a CSS grid string based on each field's `columns` setting */
  get gridColumns(): string {
    const totalCols = this.config.fields ? this.config.fields
      .map(f => f.columns ?? 1)
      .reduce((sum, c) => sum + c, 0) : 1;
    // e.g. 'repeat(3, minmax(0,1fr))'
    return `repeat(${totalCols}, minmax(0, 1fr))`;
  }

  getFormControl(name: string): FormControl {
    const ctrl = this.groupControl.get(name);
    if (!(ctrl instanceof FormControl)) {
      throw new Error(`Expected FormControl for "${name}"`);
    }
    return ctrl;
  }
}
