import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';

export interface FormFieldConfig{
  type: FieldType;
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  appearance?: MatFormFieldAppearance;
  options?: { label: string; value: any }[];
  validators?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FormConfig {
  title?: string;
  submitText?: string;
  appearance?: MatFormFieldAppearance;
  fields: FormFieldConfig[];
}

export interface FieldComponent {
  config: FormFieldConfig;
  control: FormControl;
}