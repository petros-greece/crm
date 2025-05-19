import { inject, Injectable } from '@angular/core';
import { FormFieldConfig } from '../form-builder/form-builder.model';
import { TableColumn } from '../table-builder/table-builder.component';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { TaskTypeT } from '../pages/tasks/tasks.model';
import { DataService } from './data.service';
import { DepartmentI } from '../pages/departments/departments.vars';
import { HttpClient } from '@angular/common/http';


export interface TaskTypeI { label: string; value: string; icon: string }
export interface DealTypeI { id: string; label: string; value: string; icon: string; relations: string[]; }


@Injectable({
  providedIn: 'root'
})
export class EntityFieldsService {

  dataService = inject(DataService);
  http = inject(HttpClient);


  constructor() {}

  defaultEntites = [
    'employee',
    'customer',
    'department',
    'role',
    'task',
    'product',
    'product category',
    'campaign',
  ];

  dateAndNoteMultiRowField: FormFieldConfig = {
    type: 'multi-row', name: 'notes', label: 'Notes', addRow: 'Add Note', columns: 1, defaultValue: [], fields: [
      { type: 'date', name: 'date', label: 'Date', required: false },
      { type: 'textarea', name: 'note', label: 'Note', required: false },
    ]
  }

  /** PERSON ******************************************************************************** */

  personBaseFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1, },
    { type: 'text', name: 'fullName', label: 'Full Name', required: true, validators: { minLength: 3, maxLength: 40, }, columns: 2, },
    { type: 'email', name: 'email', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2, },
    { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2, },
    { type: 'date', name: 'birthDate', label: 'Date of Birth', required: false, columns: 2, },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2, },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2, },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern: '^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2, },
  ]

  employeeFields: FormFieldConfig[] = [
    ...this.personBaseFields,
    { type: 'date', name: 'hireDate', label: 'Date of Hire', required: true, columns: 2, },
    { type: 'select', name: 'department', label: 'Department', required: true, multiple: false, dynamicOptions: this.dataService.getDepartmentOptions(), columns: 2, },
    {
      type: 'select', name: 'role', label: 'Role', required: true, multiple: false,
      dependsOn: {
        fieldName: 'department',
        updateOptions: (departmentValue: string) => {
          return this.dataService.getDepartments().pipe(
            map((departments: DepartmentI[]) => {
              const department = departments.find((d: DepartmentI) => d.label === departmentValue);
              return (department?.roles || []).map((r: { role: string }) => ({ label: r.role, value: r.role }));
            })
          );
        }
      },
      columns: 2
    },
    { type: 'slide-toggle', name: 'isActive', label: 'Is Active?', required: false, columns: 1, defaultValue: true },
    { type: 'select', name: 'crmRole', label: 'CRM Role', dynamicOptions: this.dataService.getRoleOptions(), required: true }
  ];

  /** COMPANY ******************************************************************************** */

  companyFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1 },
    { type: 'text', name: 'companyName', label: 'Company Name', required: true, validators: { minLength: 2, maxLength: 100 }, columns: 2 },
    { type: 'select', name: 'relations', label: 'Relations', required: true, multiple: true, listName: 'Company Relations', columns: 2 },
    { type: 'email', name: 'email', label: 'Email', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2 },
    { type: 'text', name: 'phoneNumber', label: 'Main Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2 },
    { type: 'text', name: 'website', label: 'Website', required: false, validators: { pattern: '^(https?:\\/\\/)?([\\w\\-])+\\.([\\w\\-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$' }, columns: 2 },
    { type: 'select', name: 'industry', label: 'Industry', required: false, multiple: false, listName: 'Industry', columns: 2 },
    { type: 'select', name: 'employeeCount', label: 'Number of Employees', required: false, listName: 'Company Size', columns: 2 },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2 },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2 },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern: '^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2 },
    { type: 'autocomplete', name: 'country', label: 'Country', required: true, listName: 'Country', columns: 2 },
    { type: 'slide-toggle', name: 'isActive', label: 'Is Active?', required: true, columns: 1, defaultValue: true },
  ];

  companyTabFields: { [tab: string]: FormFieldConfig[] } = {
    contacts: [
      {
        type: 'multi-row', name: 'contacts', label: 'Contacts', addRow: 'Add Contact', fields: [
          { type: 'text', name: 'name', label: 'Name', columns: 2 },
          {
            type: 'select',
            name: 'communication-type',
            label: 'Preffered Contact Type',
            options: [
              { label: 'Phonecall', value: 'phonecall' },
              { label: 'Email', value: 'email' },
              { label: 'sms', value: 'sms' },
              { label: 'Social Apps', value: 'social-apps' }
            ],
            columns: 1
          },
          { type: 'text', name: 'email', label: 'Email', validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 4 },
          { type: 'text', name: 'phone', label: 'Phone', validators: { pattern: '^\\+?[0-9\\s\\-()]{7,20}$' }, columns: 4 },
          { type: 'text', name: 'socialLink', label: 'Social Link', validators: { pattern: '^(https?:\\/\\/)?([\\w.-]+)\\.([a-z\\.]{2,6})([\\/\\w .-]*)*\\/?$' }, columns: 4 }
        ]
      },
    ],
    assets: [
      { type: 'file', name: 'assets', label: 'Upload Assets', columns: 1 },
    ]
  }

  /** DEAL ******************************************************************************** */

  baseDealFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1 },
    { type: 'hidden', name: 'dealTypeName', label: 'DealType', columns: 1 },
    { type: 'text', name: 'dealName', label: 'Deal Name', required: true, columns: 2, },
    { type: 'select', name: 'dealStage', label: 'Deal Stage', required: true, columns: 2, },
    { type: 'number', name: 'dealValue', label: 'Deal Value (EURO)', required: true, columns: 2, },
    //{ type: 'select', name: 'paymentMethod', label: 'Payment Method', listName: 'Payment Method', required: false, columns: 2, },
    //{ type: 'select', name: 'paymentType', label: 'Payment Type', listName: 'Payment Type', required: false, columns: 2, },
   // { type: 'select', name: 'numberOfInstallements', label: 'Number Of Installements', },
    //{ type: 'select', name: 'installementFrequency', label: 'Installement Frequency', },
   // { type: 'date', name: 'closeDate', label: 'Close Date', required: false, columns: 2, },
    { type: 'radio', name: 'revenueOrCost', label: 'Revenue or Cost' },
  ];

  /** METHODS *************************************************************************************** */

  buildEntityTableConfigColumns(entityType: string, visibleColumns?: string[]): TableColumn[] {

    let fields = [];
    if (entityType === 'company') {
      fields = [...this.companyFields];
    }
    else if (entityType === 'deal') {
      fields = [...this.baseDealFields];
      //fields = fields.filter((_, i) => ![1, 6, 7, 8, 9, 11].includes(i));
    }
    else {
      fields = [...this.employeeFields];
    }

    const cols: TableColumn[] = fields
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
          sortable: true,
          visible: !visibleColumns ? true : visibleColumns.includes(field.name) ? true : false
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

  /** TASKS ******************************************************************************** */


  private readonly taskTypesStorageKey = 'crm-task-fields';
  private readonly taskTypesJsonFile = 'assets/forms/tasks.json';

  getTaskFields(): Observable<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }> {
    const storedTaskTypes = localStorage.getItem(this.taskTypesStorageKey);
    if (storedTaskTypes) {
      try {
        const tasks = JSON.parse(storedTaskTypes);
        return of(tasks);
      } catch (error) {
        console.error('Error parsing stored tasks', error);
        return this.getTaskFieldsFromFile();
      }
    } else {
      return this.getTaskFieldsFromFile();
    }
  }

  private getTaskFieldsFromFile(): Observable<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }> {
    return this.http.get<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }>(this.taskTypesJsonFile).pipe(
      catchError(error => {
        return of({ baseFields: [], typeFields: {} });
      }),
      switchMap(tasks => {
        if (tasks && tasks.baseFields) {
          localStorage.setItem(this.taskTypesStorageKey, JSON.stringify(tasks));
        }
        return of(tasks);
      })
    );
  }

  getTaskFieldsForType(taskType: TaskTypeT): Observable<FormFieldConfig[]> {
    return this.getTaskFields().pipe(
      map(taskData => {
        const baseFields = taskData.baseFields || [];
        const typeFields = taskData.typeFields?.[taskType] || [];
        return [...baseFields, ...typeFields];
      })
    );
  }

  /** TASK-TYPES ******************************************************************************** */

  private readonly taskTypeOptionsStorageKey = 'crm-task-types';
  private readonly taskTypeOptionsJsonFile = 'assets/forms/task-types.json';

  getTaskTypeOptions(): Observable<TaskTypeI[]> {
    const storedTypes = localStorage.getItem(this.taskTypeOptionsStorageKey);
    if (storedTypes) {
      try {
        const parsed = JSON.parse(storedTypes);
        return of(parsed);
      } catch (err) {
        console.error('Error parsing stored task types', err);
        return this.getTaskTypeOptionsFromFile();
      }
    } else {
      return this.getTaskTypeOptionsFromFile();
    }
  }

  private getTaskTypeOptionsFromFile(): Observable<TaskTypeI[]> {
    return this.http.get<{ label: string; value: string; icon: string }[]>(this.taskTypeOptionsJsonFile).pipe(
      catchError(err => {
        console.error('Error loading task type options from file', err);
        return of([]);
      }),
      switchMap(taskTypes => {
        if (taskTypes && Array.isArray(taskTypes)) {
          localStorage.setItem(this.taskTypeOptionsStorageKey, JSON.stringify(taskTypes));
        }
        return of(taskTypes);
      })
    );
  }

  /** DEALS ******************************************************************************** */

  private readonly dealFieldsStorageKey = 'crm-deal-fields';
  private readonly dealFieldsJsonFile = 'assets/forms/deals.json';

  getDealFields(): Observable<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }> {
    const storedDealFields = localStorage.getItem(this.dealFieldsStorageKey);
    if (storedDealFields) {
      try {
        const deals = JSON.parse(storedDealFields);
        return of(deals);
      } catch (error) {
        console.error('Error parsing stored deal fields', error);
        return this.getDealFieldsFromFile();
      }
    } else {
      return this.getDealFieldsFromFile();
    }
  }

  private getDealFieldsFromFile(): Observable<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }> {
    return this.http.get<{ baseFields: FormFieldConfig[], typeFields: { [key: string]: FormFieldConfig[] } }>(this.dealFieldsJsonFile).pipe(
      catchError(error => {
        console.error('Error loading deal fields JSON', error);
        return of({ baseFields: [], typeFields: {} });
      }),
      switchMap(deals => {
        if (deals && deals.baseFields) {
          localStorage.setItem(this.dealFieldsStorageKey, JSON.stringify(deals));
        }
        return of(deals);
      })
    );
  }

  getDealFieldsForType(dealTypeId: string): Observable<FormFieldConfig[]> {
    return this.getDealFields().pipe(
      map(dealData => {
        const baseFields = dealData.baseFields || [];
        const typeFields = dealData.typeFields?.[dealTypeId] || [];
        return [...baseFields, ...typeFields];
      })
    );
  }

  /** DEAL-TYPES ******************************************************************************** */

  private readonly dealTypeOptionsStorageKey = 'crm-deal-types';
  private readonly dealTypeOptionsJsonFile = 'assets/forms/deal-types.json';

  getDealTypeOptions(): Observable<DealTypeI[]> {
    const storedTypes = localStorage.getItem(this.dealTypeOptionsStorageKey);
    if (storedTypes) {
      try {
        const parsed = JSON.parse(storedTypes);
        return of(parsed);
      } catch (err) {
        console.error('Error parsing stored deal types', err);
        return this.getDealTypeOptionsFromFile();
      }
    } else {
      return this.getDealTypeOptionsFromFile();
    }
  }

  private getDealTypeOptionsFromFile(): Observable<DealTypeI[]> {
    return this.http.get<DealTypeI[]>(this.dealTypeOptionsJsonFile).pipe(
      catchError(err => {
        console.error('Error loading deal type options from file', err);
        return of([]);
      }),
      switchMap(dealTypes => {
        if (dealTypes && Array.isArray(dealTypes)) {
          localStorage.setItem(this.dealTypeOptionsStorageKey, JSON.stringify(dealTypes));
        }
        return of(dealTypes);
      })
    );
  }




  // outputFormConfig: FormConfig = {
  //   title: 'Form Builder Preview',
  //   className: 'bg-gray-300 text-gray-100 p-4 rounded-lg shadow-md',
  //   fields: [],
  //   submitText: 'Test Form',
  // };


}
