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
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { SnackbarService } from '../../services/snackbar.service';
import { map } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-employees',
  imports: [
    TableBuilderComponent, 
    MatButtonModule, 
    MatIcon, 
    MatTabsModule,
    ColumnTemplateDirective, 
    FormBuilderComponent,
    TaskFormComponent,
    PageHeaderComponent
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  @ViewChild('previewEmployeeTmpl', { static: true }) previewEmployeeTmpl!: TemplateRef<any>;
  @ViewChild('addEmployeeTmpl', { static: true }) addEmployeeTmpl!: TemplateRef<any>;
  @ViewChild('taskFormTmpl', { static: true }) taskFormTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);

  tableConfig: TableConfig = {data: [], columns: []};
  tasksTableConfig: TableConfig = {data: [], columns: []};

  employeeFormConfig: FormConfig = {
    title: '',
    fields: this.entityFieldsService.employeeFields,
    submitText: 'Add Employee'
  };

  employeeData:any;
  taskData:any;

  ngOnInit(){
    this.dataService.getEmployees().subscribe(employees=>{
      this.giveEmployeeTableConfig(employees);
    })
  }

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
      cls: 'bg-violet-800 !text-white',
    })
  }

  openEditEmployeeDialog(row?: any ) {
    this.employeeData = row;
    this.employeeFormConfig = {
      title: '',
      fields: this.entityFieldsService.employeeFields,
      submitText: `Update`
    };

    this.getTasksForEmployee(this.employeeData.id);

    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Employees: ${row.fullName}`,
      content: this.previewEmployeeTmpl,
      cls: 'bg-violet-800 !text-white',
    })
  }

  addNewEmployee(formData:any){
    formData.id = `${this.tableConfig.data.length+1}`
    this.dataService.addEmployee(formData).subscribe(res=>{
      this.giveEmployeeTableConfig(res);
      this.dialogService.closeAll();
    })
  }

  updateEmployee(formData: any) {    
    this.dataService.updateEmployee(formData).subscribe(res=>{
      this.giveEmployeeTableConfig(res);
      this.dialogService.closeAll();
    })
  }

  checkDepartment(formData:any){
    console.log('check department', formData);
  }
  
  private giveEmployeeTableConfig(data: any) {
    this.tableConfig = {
      columns: this.entityFieldsService.buildEntityTableConfigColumns('employee'),
      data: data,
      pageSizeOptions: [5, 10],
      cacheOptionsProp: 'employees-table',
      pagination: true,
    };
  }

  openConfirmDeleteEmployee(){
    const name = this.employeeData.fullName;
    this.dialogService.openConfirm({
      header: 'Delete Employee',
      content: `Are you sure you want to delete employee "${name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      cls: 'bg-red-500 !text-white',
    }).subscribe(confirmed => {
      if(this.tasksTableConfig.data.length > 0){
        this.snackbarService.showSnackbar(`Please reassign ${name}'s tasks before proceeding with deletion.`);
        return;
      }

      if (confirmed === true) {
        this.dataService.deleteEmployee(this.employeeData.id).subscribe(res => {
          this.snackbarService.showSnackbar(`Employee "${name}" deleted successfully`);
          this.dialogService.closeAll();
          this.giveEmployeeTableConfig(res);
        });
      }
    }); 
  }

  /******************************************************************************** */

  openTaskDialog(){
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Add task to ${this.employeeData.fullName}`,
      content: this.taskFormTmpl,
      cls: 'bg-violet-800 !text-white',
      id: 'add-task-dialog',
    })
  }

  onAfterSubmitTask(event:any){
    this.dialogService.closeDialogById('add-task-dialog');
    this.getTasksForEmployee(this.employeeData.id);
  }

  openConfirmDeleteTaskDialog(task:any){
    console.log('delete task', task);
    this.dialogService.openConfirm({
      header: 'Delete Task',
      content: `Are you sure you want to delete task "${task.subject}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      cls: 'bg-red-500 !text-white',
    }).subscribe(confirmed => {
      if (confirmed === true) {
        this.dataService.deleteTask(task.id).subscribe(res => {
          this.snackbarService.showSnackbar(`Task "${task.subject}" deleted successfully`);
          this.dialogService.closeDialogById('add-task-dialog');
          this.getTasksForEmployee(this.employeeData.id);
        });
      }
    });
  }

  private giveTasksTableConfig(data: any) {
    this.tasksTableConfig = {
      columns: [
        {key: 'id', label: 'ID', type: 'text'}, 
        {key: 'type', label: 'Type', type: 'text'}, 
        {key: 'subject', label: 'Subject', type: 'text'}, 
        {key: 'status', label: 'Status', type: 'text'},
        {key: 'actions', label: 'Actions', type: 'custom'}      
      ],
      data: data,
      pagination: true,
      pageSizeOptions: [5, 10],
      hideButtons: true,
    };
  }

  private getTasksForEmployee(employeeId: string) {
    this.dataService.getTasksForEmployee(employeeId).pipe(
      // Filter out columns with no tasks
      map(columns => columns.filter((column:TaskColumnI) => column.tasks.length > 0)),
      // Flatten the structure and transform each task
      map(columns => columns.flatMap((column:TaskColumnI) => 
        column.tasks.map(task => ({
          id: task.data.id,
          type: task.type.label,
          status: column.title,
          subject: task.data.subject
        }))
      ))
    ).subscribe((tasks) => {
      //console.log('tasks for employee', tasks)
      this.giveTasksTableConfig(tasks);
    });
  }


}
