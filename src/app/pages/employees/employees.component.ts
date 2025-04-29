import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { TableBuilderComponent, TableConfig, ColumnTemplateDirective } from '../../table-builder/table-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { DialogService } from '../../services/dialog.service';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';
import { employees } from '../../services/data.service';
import { MatIcon } from '@angular/material/icon';
import { getDepartmentsWithRoles } from '../departments/departments.vars';

@Component({
  selector: 'app-employees',
  imports: [
    TableBuilderComponent, 
    MatButtonModule, 
    MatIcon, 
    ColumnTemplateDirective, 
    FormBuilderComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  @ViewChild('previewEEmployeeTmpl', { static: true }) previewAssetTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dialogService = inject(DialogService);

  tableConfig: TableConfig = {
    columns: this.entityFieldsService.buildEntityTableConfigColumns(),
    data: employees,
    pagination: true,
    pageSizeOptions: [5, 10]
  };

  employeeFormConfig: FormConfig = {
    title: '',
    fields: this.entityFieldsService.employeeFields,
    submitText: 'Add Employee'
  };
  employeeData:any;
  isEdit:boolean = true;
  departments = getDepartmentsWithRoles();
  selectedDepartment:string = '';

  openAddOrEditEmployeeDialog(isEdit: boolean, row?: any ) {
    this.isEdit = isEdit;
    this.employeeData = isEdit ? row : {};
    this.employeeFormConfig = {
      title: '',
      fields: this.entityFieldsService.employeeFields,
      submitText: isEdit ? `Update` : 'Add'
    };
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: isEdit ? `Employees: ${row.fullName}` : 'Add Employee',
      content: this.previewAssetTmpl,
      cls: 'bg-purple-500',
    })
  }

  addNewEmployee(data:any){
    this.isEdit ? 
    this.updateEmployee(data) :
    this.tableConfig = {
      columns: this.entityFieldsService.buildEntityTableConfigColumns(),
      data: [...employees, {...data, id: `${new Date().getTime()}`, tasks: []}],
      pagination: true,
      pageSizeOptions: [5, 10]
    };
  }

  updateEmployee(updated: any) {
    // assume each employee has a unique `id` property
    const newData = this.tableConfig.data.map(emp =>
      emp.id === updated.id ? { ...emp, ...updated } : emp
    );
  
    this.tableConfig = {
      columns: this.entityFieldsService.buildEntityTableConfigColumns(),
      data: newData,
      pagination: true,
      pageSizeOptions: [5, 10]
    };
  }

  checkDepartment(formData:any){
    console.log('check department', formData);
  }
  
}
