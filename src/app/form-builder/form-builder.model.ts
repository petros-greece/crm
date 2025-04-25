import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface Option {
  label: string;
  value: any;
}

export type FieldType = 'text' | //
                        'number' | //
                        'email' | //
                        'password' | //
                        'select' | //
                        'checkbox' | 
                        'radio' | //
                        'textarea' | 
                        'date' | //
                        'autocomplete' | //
                        'multi-row' | //
                        'slide-toggle' | //
                        'range-picker' | //
                        'slider-range' | //
                        'file' | //
                        'icon' | //
                        'color' |// 
                        'time' | 
                        'url' | 
                        'tel' | 
                        'chips' | //
                        'slider'; //

export interface FormFieldConfig{
  type: FieldType;
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  appearance?: MatFormFieldAppearance;
  multiple?: boolean;
  options?: { label: string; value: any }[];
  minDate?: Date;
  maxDate?: Date;
  step?: number;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  initialRows?: number;
  formatLabel?: (value: number) => string;
  autocomplete?: string;
  className?: string;
  icon?: string;
  columns?: number; // For grid layout
  validators?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  fields?: FormFieldConfig[]; // For nested fields
  dynamicOptions?: Observable<Option[]> | (() => Promise<Option[]>);
  listName?: string; // For dynamic options
  acceptedTypes?: string,
}

export interface FormConfig {
  title?: string;
  submitText?: string;
  appearance?: MatFormFieldAppearance;
  className?: string;
  resetOnSubmit?:boolean;
  fields: FormFieldConfig[];
}

export interface FieldComponent<T extends AbstractControl = FormControl> {
  config: FormFieldConfig;
  control: T;
}

export type FieldFormConfig  = {field:string, text:string, config: FormConfig};