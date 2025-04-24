import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { AbstractControl } from '@angular/forms';

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
  minDate?: number;
  maxDate?: number;
  step?: number;
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
}

export interface FormConfig {
  title?: string;
  submitText?: string;
  appearance?: MatFormFieldAppearance;
  fields: FormFieldConfig[];
}

export interface FieldComponent<T extends AbstractControl = FormControl> {
  config: FormFieldConfig;
  control: T;
}