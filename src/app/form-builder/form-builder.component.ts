import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormConfig, FormFieldConfig } from './form-builder.model';
import { SelectFieldComponent } from './fields/select-field.component';
import { AutocompleteFieldComponent } from './fields/autocomplete-field.component';
import { DatepickerFieldComponent } from './fields/datepicker-field.component';
import { RadioGroupFieldComponent } from './fields/radio-group-field.component';
import { SliderFieldComponent } from './fields/slider-field.component';
import { InputFieldComponent } from './fields/input-field.component';
import { MultiRowFieldComponent } from './fields/multi-row-field.component';
import { SlideToggleFieldComponent } from './fields/slide-toggle-field.component';
import { DateRangeFieldComponent } from './fields/date-range-field.component';
import { SliderRangeFieldComponent } from './fields/slider-range-field.component';
import { AutocompleteChipFieldComponent } from './fields/autocomplete-chips-field.component';
import { FileUploadComponent } from './fields/file-upload-field.component';
import { ColorPickerFieldComponent } from './fields/colorpicker-field.component';
import { TextareaFieldComponent } from './fields/textarea-field.component';
import { IconPickerFieldComponent } from './fields/icon-picker-field.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
  <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-wrap gap-4" (keydown.enter)="$event.preventDefault()">      
    <ng-container #gridItem></ng-container>    
    <button mat-raised-button type="submit">{{ config.submitText || 'Submit' }}</button>
  </form>
  `
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
  @Input() config: FormConfig = { fields: [] };
  @Input() values: { [key: string]: any } = {};
  formGroup = new FormGroup({});

  @ViewChild('gridItem', { read: ViewContainerRef }) gridItem!: ViewContainerRef;


  ngOnInit(): void {
    this.config = this.applyValuesToFormConfig(this.config, this.values);
    this.buildForm();
  }

  ngAfterViewInit() {
    this.buildFields();
  }

  applyValuesToFormConfig(config: FormConfig, values: { [key: string]: any }): FormConfig {
    const updatedFields = config.fields.map(field => {
      const fieldValue = values[field.name];
  
      if (fieldValue === undefined) {
        return field; // no change if value isn't provided
      }
  
      // Handle multi-row separately
      if (field.type === 'multi-row' && Array.isArray(fieldValue)) {
        return {
          ...field,
          value: fieldValue
        };
      }
  
      // Handle range-based controls like slider-range or date-range
      if ((field.type === 'slider-range' || field.type === 'range-picker') && typeof fieldValue === 'object') {
        return {
          ...field,
          value: {
            start: fieldValue.start ?? null,
            end: fieldValue.end ?? null
          }
        };
      }
  
      // Handle everything else
      return {
        ...field,
        value: fieldValue
      };
    });
  
    return {
      ...config,
      fields: updatedFields
    };
  }
  

  buildForm() {
    const formGroup: { [key: string]: any } = {};
  
    this.config.fields.forEach(field => {
      const fieldValue = field.value ?? null;
  
      if (field.type === 'multi-row') {
        const rowArray = new FormArray<any>([]);
        if (Array.isArray(fieldValue)) {
          fieldValue.forEach(row => {
            rowArray.push(this.createRowGroup(field, row));
          });
        } 
        else {
          rowArray.push(this.createRowGroup(field));
        }
        formGroup[field.name] = rowArray;
      }
      else if (field.type === 'range-picker' || field.type === 'slider-range') {
        formGroup[field.name] = new FormGroup({
          start: new FormControl(fieldValue?.start ?? null),
          end: new FormControl(fieldValue?.end ?? null)
        });
      }
      else {
        const validators = this.getValidators(field);
        formGroup[field.name] = new FormControl(fieldValue, validators);
      }
    });
  
    this.formGroup = new FormGroup(formGroup);
  }

  private createRowGroup(field: FormFieldConfig, rowValues?: any): FormGroup {
    const group: { [key: string]: FormControl } = {};
    field.fields?.forEach(subField => {
      const validators = this.getValidators(subField);
      group[subField.name] = new FormControl(
        rowValues?.[subField.name] || subField.value || '',
        validators
      );
    });
    return new FormGroup(group);
  }

  buildFields() {
    const gap = 1; // in rem, matching `gap-4`
    this.config.fields.forEach(field => {
      const componentType = this.resolveFieldComponent(field.type);
      const control = this.formGroup.get(field.name);
      if (componentType && control) {
        const componentRef = this.gridItem.createComponent(componentType);
        componentRef.instance.config = field;
        componentRef.instance.control = control;
        const cols = field.columns || 1; 
        
        const basis =   window.innerWidth < 700 ? '100%' : `calc((100% - ${(cols - 1) * gap}rem) / ${cols})`;
        const hostEl = componentRef.location.nativeElement as HTMLElement;
        hostEl.style.flex      = `0 0 ${basis}`;
        hostEl.style.maxWidth  = basis;

      }
    });
  }

  private getValidators(field: FormFieldConfig) {
    const validators = [];
    if (field.required) validators.push(Validators.required);
    if (field.validators) {
      if (field.validators.minLength) validators.push(Validators.minLength(field.validators.minLength));
      if (field.validators.maxLength) validators.push(Validators.maxLength(field.validators.maxLength));
      if (field.validators.pattern) validators.push(Validators.pattern(field.validators.pattern));
      if (field.validators.min) validators.push(Validators.min(field.validators.min));
      if (field.validators.max) validators.push(Validators.max(field.validators.max));
    }
    return validators;
  }

  resolveFieldComponent(type: string): Type<any> {
    switch (type) {
      case 'select': return SelectFieldComponent;
      case 'autocomplete': return AutocompleteFieldComponent;
      case 'date': return DatepickerFieldComponent;
      case 'radio': return RadioGroupFieldComponent;
      case 'slider': return SliderFieldComponent;
      case 'multi-row': return MultiRowFieldComponent;
      case 'slide-toggle': return SlideToggleFieldComponent;
      case 'range-picker': return DateRangeFieldComponent;
      case 'slider-range': return SliderRangeFieldComponent;
      case 'chips': return AutocompleteChipFieldComponent;
      case 'file': return FileUploadComponent;
      case 'color': return ColorPickerFieldComponent;
      case 'textarea': return TextareaFieldComponent;
      case 'text': return InputFieldComponent;
      case 'icon': return IconPickerFieldComponent
      default: return InputFieldComponent;
    }
  }

  onSubmit() {console.log('Form Submitted:', this.formGroup.value);
    if (this.formGroup.valid) {
      console.log('Form Submitted:', this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

}