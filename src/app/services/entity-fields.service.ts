import { Injectable } from '@angular/core';
import { FormFieldConfig } from '../form-builder/form-builder.model';
import { TableColumn } from '../table-builder/table-builder.component';
import { getDepartmentsWithRoles, roles } from '../pages/departments/departments.vars';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityFieldsService {

  constructor() {}

  defaultEntites = [
    'employee', 
    'customer',
    'departement',
    'role', 
    'task',
    'product', 
    'product category',
    'campaign',
  ];



  /** PERSON ******************************************************************************** */

  personBaseFields:FormFieldConfig[] = [
    { type: 'text', name: 'fullName', label: 'Full Name', required: true, validators: { minLength: 3, maxLength: 40, }, columns: 2, },
    { type: 'email', name: 'email', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2, },
    { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2, },
    { type: 'date', name: 'birthDate', label: 'Date of Birth', required: false, columns: 2, },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2, },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2, },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern:'^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2, },
  ]

  employeeFields:FormFieldConfig[] = [
    ...this.personBaseFields,
    { type: 'date', name: 'hireDate', label: 'Date of Hire', required: true, columns: 2, },
    { type: 'select', name: 'department', label: 'Department', required: true, multiple: false, options: getDepartmentsWithRoles(), columns: 2, },
    { type: 'select', name: 'role', label: 'Role', required: true, multiple: false, 
      dependsOn: {
        fieldName: 'department',
        updateOptions: (department: string) => {
          console.log('update options', roles[department]);
          if (roles[department]) {
            const options = roles[department].map(r => ({ label: r, value: r }));
            return of(options);
          }
          return of([]);
        } 
      },
      columns: 2 
    },
    { type: 'slide-toggle', name: 'isActive', label: 'Is Active?', required: true, columns: 1, },
    // { type: 'multi-row', name: 'tasks', label: 'Tasks', addRow: 'Add Task', fields: [
    //   {
    //     type: 'select',
    //     name: 'type',
    //     label: 'Task Type',
    //     listName: 'Jobs', 
    //   },
    //   { type: 'date', name: 'startDate', label: 'Start Date', required: true },
    //   { type: 'date', name: 'endDate', label: 'End Date', required: true },
    //   ]
    // }
  ];

  customerFields:FormFieldConfig[] = [
    ...this.personBaseFields,
    { type: 'slide-toggle', name: 'isCompany', label: 'Date of Hire', required: true, columns: 2, },
  ];



  /** METHODS *************************************************************************************** */

  buildEntityTableConfigColumns(): TableColumn[] {
    const cols: TableColumn[] = this.employeeFields
    .filter(field => field.type !== 'multi-row')
    .map(field => {
      // decide column type
      let colType: TableColumn['type'] = 'text';
      switch (field.type) {
        case 'date': case 'range-picker': colType = 'date'; break;
        case 'slider': case 'slider-range': colType = 'number'; break;
        case 'slide-toggle': colType = 'boolean'; break;
        default: colType = 'text';
      }
  
      const col: TableColumn = {
        key: field.name,
        label: field.label,
        type: colType,
        sortable: true
      };
  
      // add a default date format
      if (colType === 'date') {
        col.format = 'MMM d, y';
      }
  
      return col;
    });
  
    // append a custom Actions column
    cols.push({
      key: 'actions',
      label: 'Actions',
      type: 'custom'
    });
  
    return cols;
  }


  // outputFormConfig: FormConfig = {
  //   title: 'Form Builder Preview',
  //   className: 'bg-gray-300 text-gray-100 p-4 rounded-lg shadow-md',
  //   fields: [],
  //   submitText: 'Test Form',
  // };
  

}
