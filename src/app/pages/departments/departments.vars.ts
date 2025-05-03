import { FormFieldConfig } from "../../form-builder/form-builder.model";

export interface DepartmentI { id:string; label: string; value: string; icon: string, roles?:any[]};

export class DepartmentsVars {
  departments:DepartmentI[] = [];

  departmentBaseFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'id', required: false, columns: 1 }, 
    { type: 'text', name: 'label', label: 'Name', required: true, validators: { minLength: 3, maxLength: 100 }, columns: 2 },
    { type: 'icon', name: 'icon', label: 'Select Icon', required: false, columns: 2 },
    {
      type: 'multi-row',
      addRow: 'Add Role',
      name: 'roles',
      label: 'Department Roles',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          type: 'text',
          name: 'role',
          label: 'Role Name',
          required: true,
        }
      ]
    },    
  ];

}