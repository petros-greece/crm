import { Component, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-multi-row-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
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
    <div class="multi-row-container">
      <div class="row-header">
        <h4>{{ config.label }}</h4>
        <button mat-stroked-button 
                type="button"
                color="primary" 
                (click)="addRow()"
                [disabled]="!canAdd">
          <mat-icon>add</mat-icon>
          {{ config.addRow || 'Add Row' }}
        </button>
      </div>
      <div>
        <div class="row-container" *ngFor="let row of rows.controls; index as i">
        <div class="fields-container">
          <div *ngFor="let field of config.fields" 
              class="field-wrapper"
              [style.grid-column]="'span ' + (field.columns || 1)">
            <ng-container [ngSwitch]="field.type">
              
              <!-- Shared input field for text-based types -->
              <ng-container *ngSwitchDefault>
                <app-input-field
                  *ngIf="['text', 'number', 'password', 'email'].includes(field.type)"
                  [config]="field"
                  [control]="getRowControl(i, field.name)">
                </app-input-field>
              </ng-container>

              <!-- Specific field types -->
              <app-select-field *ngSwitchCase="'select'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-select-field>

              <app-date-field *ngSwitchCase="'date'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-date-field>

              <app-textarea-field *ngSwitchCase="'textarea'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-textarea-field>

              <app-slide-toggle-field *ngSwitchCase="'slide-toggle'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-slide-toggle-field>

              <app-radio-group-field *ngSwitchCase="'radio'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-radio-group-field>

              <app-color-picker-field *ngSwitchCase="'color'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-color-picker-field>

              <app-autocomplete-field *ngSwitchCase="'autocomplete'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-autocomplete-field>

              <app-autocomplete-chips *ngSwitchCase="'chips'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-autocomplete-chips>

              <app-slider-field *ngSwitchCase="'slider'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-slider-field>

              
              <app-slide-toggle-field *ngSwitchCase="'slide-toggle'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-slide-toggle-field>

              <!-- <app-slider-range-field *ngSwitchCase="'slider-range'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-slider-range-field> -->

              <app-icon-picker-field *ngSwitchCase="'icon'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-icon-picker-field>

              <app-file-upload *ngSwitchCase="'file'"
                [config]="field"
                [control]="getRowControl(i, field.name)">
              </app-file-upload>

            </ng-container>
          </div>
</div>

          <button mat-icon-button 
                  color="warn" 
                  (click)="removeRow(i)"
                  [disabled]="!canRemove">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .multi-row-container {
      margin: 24px 0;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
    }

    .row-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .row-container {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .fields-container {
      flex-grow: 1;
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .field-wrapper {
      //min-width: 200px;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiRowFieldComponent),
    multi: true
  }]
})
export class MultiRowFieldComponent extends BaseFieldComponent<FormArray> implements OnInit {

  // override ngOnInit(): void {
  //   super.ngOnInit();

  //   // Ensure at least one row exists
  //   if (this.rows.length === 0) {
  //     this.addRow();
  //   }
  // }

  get rows(): FormArray {
    return this.control;
  }

  getRowControl(rowIndex: number, fieldName: string): FormControl {
    const group = this.rows.at(rowIndex);
    if (!(group instanceof FormGroup)) {
      throw new Error(`Expected FormGroup at index ${rowIndex}`);
    }
    const control = group.get(fieldName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Expected FormControl for field ${fieldName}`);
    }
    return control;
  }

  addRow() {
    const group: { [key: string]: FormControl } = {};
    this.config.fields?.forEach(field => {
      group[field.name] = new FormControl(field.value || '');
    });
    //this.rows.push(new FormGroup(group));
    this.rows.insert(0, new FormGroup(group));
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  get canAdd(): boolean {
    return true; // Add your own logic if needed
  }

  get canRemove(): boolean {
    return this.rows.length > 1;
  }
}
