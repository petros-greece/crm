import { Injectable } from '@angular/core';
import { FormFieldConfig } from '../form-builder/form-builder.model';

@Injectable({
  providedIn: 'root'
})
export class EntityFieldsService {

  constructor() {}

  employeeFields:FormFieldConfig[] = [
    { type: 'text', name: 'fullName', label: 'Full Name', required: true, validators: { minLength: 3, maxLength: 40, }, columns: 2, },
    { type: 'email', name: 'email', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2, },
    { type: 'date', name: 'birthDate', label: 'Date of Birth', appearance: 'fill', required: true, columns: 2, },
  ];



}
