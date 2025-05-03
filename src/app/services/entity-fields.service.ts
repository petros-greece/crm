import { inject, Injectable } from '@angular/core';
import { FormFieldConfig } from '../form-builder/form-builder.model';
import { TableColumn } from '../table-builder/table-builder.component';
import { of } from 'rxjs';
import { TaskTypeT } from '../pages/tasks/tasks.model';
import { DataService } from './data.service';
import { DepartmentI } from '../pages/departments/departments.vars';

@Injectable({
  providedIn: 'root'
})
export class EntityFieldsService {

  dataService = inject(DataService)
  departments:any = [];
  constructor() {
    this.dataService.getDepartments().subscribe(d=>this.departments = d)
  }

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

  /** PERSON ******************************************************************************** */

  personBaseFields:FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: '', columns: 1, },
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
    { type: 'select', name: 'department', label: 'Department', required: true, multiple: false, dynamicOptions: this.dataService.getDepartmentOptions(), columns: 2, },
    { type: 'select', name: 'role', label: 'Role', required: true, multiple: false, 
      dependsOn: {
        fieldName: 'department',
        updateOptions: (departmentValue: string) => {
          
          // Find the department with matching value
          const department = this.departments.find((d:DepartmentI) => d.id === departmentValue);
          
          if (!department || !department.roles) {
            return of([]); // Return empty array if no department or roles found
          }
          // Map roles to options format
          const options = department.roles.map((r:any) => ({
            label: r.role,
            value: r.role
          }));
          
          return of(options);
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

  /** TASKS ******************************************************************************** */

  
  taskBaseFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: '', required: false },
    { type: 'text', name: 'subject', label: 'Subject', required: true, validators: { minLength: 3, maxLength: 100 }, columns: 1 },
    { type: 'select', name: 'priority', label: 'Priority', required: false, multiple: false, listName: 'Priority', columns: 2 },
    { type: 'date', name: 'dueDate', label: 'Due Date', required: false, columns: 2 },
    { type: 'textarea', name: 'notes', label: 'Notes', required: false, validators: { minLength: 0, maxLength: 500 }, columns: 1 },
    { type: 'autocomplete', name: 'assignee', label: 'Assignee', required: true, dynamicOptions: this.dataService.getEmployeeOptions(), columns: 1 },
  ];
  
  taskTypeFields: Record<TaskTypeT, FormFieldConfig[]> = {
    
    call: [
      { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2 },
      { type: 'select', name: 'callOutcome', label: 'Call Outcome', required: false, multiple: false, listName: 'Call Outcome', columns: 2 },
    ],
    email: [
      { type: 'email', name: 'emailAddress', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 1 },
      { type: 'textarea', name: 'emailBody', label: 'Email Body', required: true, columns: 1 },
    ],
    meeting: [
      { type: 'text', name: 'location', label: 'Location/Link', required: false, columns: 2 },
      { type: 'number', name: 'duration', label: 'Duration (minutes)', required: false, columns: 2 },
      { type: 'textarea', name: 'agenda', label: 'Agenda', required: false, columns: 1 },
    ],
    followUp: [
      { type: 'text', name: 'relatedLead', label: 'Related Lead/Opportunity', required: false, columns: 1 },
    ],
    proposal: [
      { type: 'text', name: 'amount', label: 'Proposal Amount', required: true, columns: 2 },
      { type: 'text', name: 'proposalLink', label: 'Proposal Link', required: false, columns: 2 },
      { type: 'date', name: 'expirationDate', label: 'Expiration Date', required: false, columns: 2 },
    ],
    onboarding: [
      { type: 'select', name: 'onboardingStep', label: 'Onboarding Step', required: false, multiple: false, listName: 'Onboarding Steps', columns: 1 },
      { type: 'date', name: 'startDate', label: 'Start Date', required: false, columns: 2 },
      { type: 'date', name: 'endDate', label: 'End Date', required: false, columns: 2 },
    ],
    supportRequest: [
      { type: 'textarea', name: 'issueDescription', label: 'Issue Description', required: true, columns: 1 }
    ],
    contractSigning: [
      { type: 'text', name: 'contractLink', label: 'Contract Link', required: true, columns: 2 },
      { type: 'select', name: 'signingStatus', label: 'Signing Status', required: true, multiple: false, listName: 'Signing Statuses', columns: 2 },
      { type: 'date', name: 'deadline', label: 'Deadline', required: false, columns: 2 },
    ],
    renewalReminder: [
      { type: 'date', name: 'renewalDate', label: 'Renewal Date', required: true, columns: 2 },
      { type: 'text', name: 'amount', label: 'Renewal Amount', required: false, columns: 2 },
    ],
    paymentFollowUp: [
      { type: 'text', name: 'invoiceNumber', label: 'Invoice Number', required: true, columns: 2 },
      { type: 'text', name: 'amountDue', label: 'Amount Due', required: true, columns: 2 },
    ],
    surveyRequest: [
      { type: 'text', name: 'surveyLink', label: 'Survey Link', required: true, columns: 2 },
      { type: 'date', name: 'sendDate', label: 'Send Date', required: true, columns: 2 },
    ],
    internalNote: [
      { type: 'textarea', name: 'noteBody', label: 'Note', required: true, columns: 1 },
    ],
    leadQualification: [
      { type: 'select', name: 'qualificationStatus', label: 'Qualification Status', required: false, multiple: false, listName: 'Lead Qualification', columns: 1 },
    ],
    marketingTask: [
      { type: 'text', name: 'campaignName', label: 'Campaign Name', required: true, columns: 2 },
      { type: 'select', name: 'taskType', label: 'Task Type', required: true, multiple: false, listName: 'Marketing Task Type', columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    birthdayReminder: [
      { type: 'select', name: 'occasionType', label: 'Occasion Type', required: true, multiple: false, listName: 'Occasion Type', columns: 2 },
      { type: 'date', name: 'date', label: 'Date', required: true, columns: 2 },
    ],
    productDemo: [
      { type: 'text', name: 'demoLink', label: 'Demo Link', required: false, columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    accountReview: [
      { type: 'date', name: 'reviewDate', label: 'Review Date', required: true, columns: 2 },
      { type: 'text', name: 'assignedRep', label: 'Assigned Representative', required: false, columns: 2 },
    ],
    trainingSession: [
      { type: 'text', name: 'trainingTopic', label: 'Training Topic', required: true, columns: 2 },
      { type: 'text', name: 'trainer', label: 'Trainer', required: false, columns: 2 },
      { type: 'date', name: 'trainingDate', label: 'Training Date', required: true, columns: 2 },
    ],
  };

  getTaskFields(taskType: TaskTypeT):FormFieldConfig[]{
    return [...this.taskBaseFields, ...this.taskTypeFields[taskType]];
  }

  // outputFormConfig: FormConfig = {
  //   title: 'Form Builder Preview',
  //   className: 'bg-gray-300 text-gray-100 p-4 rounded-lg shadow-md',
  //   fields: [],
  //   submitText: 'Test Form',
  // };
  

}
