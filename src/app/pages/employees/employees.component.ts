import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { TableBuilderComponent, TableConfig, ColumnTemplateDirective } from '../../table-builder/table-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { DialogService } from '../../services/dialog.service';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';
import { TaskColumnI } from '../tasks/tasks.model';

import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { DataService } from '../../services/data.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-employees',
  imports: [
    TableBuilderComponent, 
    MatButtonModule, 
    MatIcon, 
    MatTabsModule,
    ColumnTemplateDirective, 
    FormBuilderComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  @ViewChild('previewEmployeeTmpl', { static: true }) previewEmployeeTmpl!: TemplateRef<any>;
  @ViewChild('addEmployeeTmpl', { static: true }) addEmployeeTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);
  dialogService = inject(DialogService);

  tableConfig: TableConfig = {
    columns: [],
    data: [],
    pagination: true,
    pageSizeOptions: [5, 10]
  };

  tasksTableConfig: TableConfig = {
    columns: [],
    data: [],
    pagination: true,
    pageSizeOptions: [5, 10]
  };


  employeeData:any;
  //isEdit:boolean = true;
  //selectedDepartment:string = '';

  ngOnInit(){
    this.dataService.getEmployees().subscribe(employees=>{
      this.tableConfig = {
        columns: this.entityFieldsService.buildEntityTableConfigColumns('employee'),
        data: employees,
        pagination: true,
        pageSizeOptions: [5, 10]
      };
      console.log(this.tableConfig)
    })
  }

  employeeFormConfig: FormConfig = {
    title: '',
    fields: this.entityFieldsService.employeeFields,
    submitText: 'Add Employee'
  };

  openNewEmployeeDialog(){
    this.employeeData = {};
    this.employeeFormConfig = {
      title: '',
      fields: this.entityFieldsService.employeeFields,
      submitText: 'Add'
    };

    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Add Eployee`,
      content: this.addEmployeeTmpl,
      cls: 'bg-purple-500',
    })
  }

  openEditEmployeeDialog(row?: any ) {
    this.employeeData = row;
    this.employeeFormConfig = {
      title: '',
      fields: this.entityFieldsService.employeeFields,
      submitText: `Update`
    };


    this.dataService.getTasksForEmployee(this.employeeData.id).pipe(
      // Filter out columns with no tasks
      map(columns => columns.filter((column:TaskColumnI) => column.tasks.length > 0)),
      // Flatten the structure and transform each task
      map(columns => columns.flatMap((column:TaskColumnI) => 
        column.tasks.map(task => ({
          type: task.type.label,
          status: column.title,
          subject: task.data.subject
        }))
      ))
    ).subscribe((tasks) => {
      console.log('tasks for employee', tasks)
      this.tasksTableConfig = {
        columns: [{key: 'type', label: 'Type', type: 'text'}, {key: 'subject', label: 'Subject', type: 'text'}, {key: 'status', label: 'Status', type: 'text'}],
        data: tasks,
        pagination: true,
        pageSizeOptions: [5, 10]
      };
    }
      
    );


    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Employees: ${row.fullName}`,
      content: this.previewEmployeeTmpl,
      cls: 'bg-purple-500',
    })
  }

  addNewEmployee(formData:any){
    formData.id = `${this.tableConfig.data.length+1}`
    this.dataService.addEmployee(formData).subscribe(res=>{
      this.tableConfig = {
        columns: this.entityFieldsService.buildEntityTableConfigColumns('employee'),
        data: res,
        pagination: true,
        pageSizeOptions: [5, 10]
      };
    })
  }

  updateEmployee(formData: any) {
    
    this.dataService.updateEmployee(formData).subscribe(res=>{
      this.tableConfig = {
        columns: this.entityFieldsService.buildEntityTableConfigColumns('employee'),
        data: res,
        pagination: true,
        pageSizeOptions: [5, 10]
      };
    })

  }

  checkDepartment(formData:any){
    console.log('check department', formData);
  }
  
}
