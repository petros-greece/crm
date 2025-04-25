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
    { type: 'date', name: 'hireDate', label: 'Date of Hire', appearance: 'fill', required: true, columns: 2, },
    { type: 'select', name: 'role', label: 'Role', required: true, multiple: false, options: [ { label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }, ], columns: 2, },
    { type: 'select', name: 'department', label: 'Department', required: true, multiple: false, options: [ { label: 'HR', value: 'hr' }, { label: 'IT', value: 'it' }, ], columns: 2, },
    { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2, },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2, },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2, },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern:'^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2, },
  ];



}
