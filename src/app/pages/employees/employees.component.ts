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
import { map, Subject, takeUntil, tap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
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

  private destroy$ = new Subject<void>();

  @ViewChild('previewEmployeeTmpl', { static: true }) previewEmployeeTmpl!: TemplateRef<any>;
  @ViewChild('addEmployeeTmpl', { static: true }) addEmployeeTmpl!: TemplateRef<any>;
  @ViewChild('taskFormTmpl', { static: true }) taskFormTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);

  private originalTaskColumns: TaskColumnI[] = [];

  tableConfig: TableConfig = { data: [], columns: [] };
  tasksTableConfig: TableConfig = { data: [], columns: [] };

  employeeFormConfig: FormConfig = {
    title: '',
    fields: this.entityFieldsService.employeeFields,
    submitText: 'Add Employee'
  };

  employeeData: any;
  taskData: any;

  extraForms: any = [];

  ngOnInit() {
    this.dataService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => this.giveEmployeeTableConfig(employees));

    this.entityFieldsService.getEntityFields('employee')
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => this.extraForms = resp);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private giveEmployeeFormConfig(submitText: string = 'Add') {
    this.employeeFormConfig = {
      fields: this.entityFieldsService.employeeFields,
      submitText: submitText
    };
  }

  private onAfterSubmitEmployee(res:any, message:string) {
    this.dialogService.closeAll();
    this.giveEmployeeTableConfig(res);
    this.snackbarService.showSnackbar(message);
  }

  openNewEmployeeDialog() {
    this.employeeData = {};
    this.giveEmployeeFormConfig('Add');

    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Add Eployee`,
      content: this.addEmployeeTmpl,
      cls: 'bg-violet-800 !text-white',
    })
  }

  openEditEmployeeDialog(row?: any) {
    this.employeeData = row;
    this.giveEmployeeFormConfig('Update');
    this.getTasksForEmployee(this.employeeData.id);

    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: `Employees: ${row.fullName}`,
      content: this.previewEmployeeTmpl,
      cls: 'bg-violet-800 !text-white',
    })
  }

  addNewEmployee(formData: any) {
    formData.id = `${this.tableConfig.data.length + 1}`
    this.dataService.addEmployee(formData).subscribe(res => {
      this.onAfterSubmitEmployee(res, `Employee Added succesfully!`);
    })
  }

  updateEmployee(formData: any) {
    const data = {...this.employeeData, ...formData};
    this.dataService.updateEmployee(data).subscribe(res => {
      this.onAfterSubmitEmployee(res, `Employee Updated succesfully!`);
    })
  }

  openConfirmDeleteEmployee(employeeData: any) {
    const name = employeeData.fullName;
    this.dialogService.openConfirm({
      header: 'Delete Employee',
      content: `Are you sure you want to delete employee "${name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      cls: 'bg-red-500 !text-white',
    }).subscribe(confirmed => {
      if (confirmed === true) {
        if (this.tasksTableConfig.data.length > 0) {
          this.snackbarService.showSnackbar(`Please reassign ${name}'s tasks before proceeding with deletion.`);
          return;
        }
        this.dataService.deleteEmployee(employeeData.id).subscribe(res => {
          this.onAfterSubmitEmployee(res, `Employee "${name}" deleted successfully`);
        });
      }
    });
  }

  updateEmployeeExtraFields(formData: any, title: string) {
    //console.log(formData, title);
    const id = this.employeeData.id;
    this.dataService.updateEmployeeSection(id, title, formData).subscribe((res) => {
      this.onAfterSubmitEmployee(res, `Employee section "${title}" updated successfully`);
    })
  }

  /** TASKS ****************************************************************************** */

  private findTaskById(taskId: number): any {
    for (const column of this.originalTaskColumns) {
      const task = column.tasks.find(t => t.data.id === taskId);
      if (task) {
        return task;
      }
    }
    return null;
  }

  private giveTasksTableConfig(data: any) {
    this.tasksTableConfig = {
      columns: [
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'type', label: 'Type', type: 'text' },
        { key: 'subject', label: 'Subject', type: 'text' },
        { key: 'status', label: 'Status', type: 'text' },
        { key: 'actions', label: 'Actions', type: 'custom' }
      ],
      data: data,
      pagination: true,
      pageSizeOptions: [5, 10],
      hideButtons: true,
    };
  }

  private getTasksForEmployee(employeeId: string) {
    this.dataService.getTasksForEmployee(employeeId)
      .pipe(
        takeUntil(this.destroy$),
        tap((columns: TaskColumnI[]) => {
          this.originalTaskColumns = columns;
        }),
        map(columns => columns.filter(column => column.tasks.length > 0)),
        map(columns => columns.flatMap(column =>
          column.tasks.map(task => ({
            id: task.data.id,
            type: task.type.label,
            status: column.title,
            subject: task.data.subject
          }))
        ))
      )
      .subscribe(tasks => this.giveTasksTableConfig(tasks));
  }

  openTaskDialog(taskData: any) {
    this.taskData = taskData ? this.findTaskById(taskData.id) : taskData;
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: taskData ? `${this.taskData.type.label}` : `Add task to ${this.employeeData.fullName}`,
      content: this.taskFormTmpl,
      id: 'add-task-dialog',
      icon: taskData ? `${this.taskData.type.icon}` : ''
    })
  }

  onAfterSubmitTask(event: any) {
    this.dialogService.closeDialogById('add-task-dialog');
    this.getTasksForEmployee(this.employeeData.id);
  }

  openConfirmDeleteTaskDialog(task: any) {
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



}
