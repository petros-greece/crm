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
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { InputFieldComponent } from '../input-field/input-field.component';
import { SelectFieldComponent } from '../select-field/select-field.component';
import { DatepickerFieldComponent } from '../datepicker-field/datepicker-field.component';
import { TextareaFieldComponent } from '../textarea-field/textarea-field.component';
import { SlideToggleFieldComponent } from '../slide-toggle-field/slide-toggle-field.component';
import { RadioGroupFieldComponent } from '../radio-group-field/radio-group-field.component';
import { ColorPickerFieldComponent } from '../colorpicker-field/colorpicker-field.component';
import { AutocompleteFieldComponent } from '../autocomplete-field/autocomplete-field.component';
import { AutocompleteChipFieldComponent } from '../autocomplete-chips-field/autocomplete-chips-field.component';
import { SliderFieldComponent } from '../slider-field/slider-field.component';
import { SliderRangeFieldComponent } from '../slider-range-field/slider-range-field.component';
import { IconPickerFieldComponent } from '../icon-picker-field/icon-picker-field.component';
import { FileUploadComponent } from '../file-upload-field/file-upload-field.component';

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
    DatepickerFieldComponent,
    TextareaFieldComponent,
    SlideToggleFieldComponent,
    RadioGroupFieldComponent,
    ColorPickerFieldComponent,
    AutocompleteFieldComponent,
    AutocompleteChipFieldComponent,
    SliderFieldComponent,
    SliderRangeFieldComponent,
    IconPickerFieldComponent,
    FileUploadComponent
  ],
  template: `
    <fieldset class="border p-4 rounded">
      <legend class="px-2 font-semibold">{{ config.label }}</legend>
      <div class="grid gap-4" [style.gridTemplateColumns]="gridColumns">
        <ng-container *ngFor="let field of config.fields">
          <ng-container [ngSwitch]="field.type">

            <!-- Shared input field for text-based types -->
            <ng-container *ngSwitchDefault>
              <app-input-field
                *ngIf="['text', 'number', 'password', 'email'].includes(field.type)"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-input-field>
            </ng-container>

            <!-- Specific field types -->
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

            <app-textarea-field 
              *ngSwitchCase="'textarea'"
              [config]="field"
              [control]="getFormControl(field.name)">
            </app-textarea-field>

              <app-slide-toggle-field *ngSwitchCase="'slide-toggle'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-slide-toggle-field>

              <app-radio-group-field *ngSwitchCase="'radio'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-radio-group-field>

              <app-color-picker-field *ngSwitchCase="'color'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-color-picker-field>

              <app-autocomplete-field *ngSwitchCase="'autocomplete'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-autocomplete-field>

              <app-autocomplete-chips *ngSwitchCase="'chips'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-autocomplete-chips>

              <app-slider-field *ngSwitchCase="'slider'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-slider-field>

              
              <app-slide-toggle-field *ngSwitchCase="'slide-toggle'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-slide-toggle-field>

              <!-- <app-slider-range-field *ngSwitchCase="'slider-range'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-slider-range-field> -->

              <app-icon-picker-field *ngSwitchCase="'icon'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-icon-picker-field>

              <app-file-upload *ngSwitchCase="'file'"
                [config]="field"
                [control]="getFormControl(field.name)">
              </app-file-upload>

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
  implements ControlValueAccessor, OnInit {
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
