import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TaskItemI, TaskTypeT } from '../../pages/tasks/tasks.model';
import { MatIcon } from '@angular/material/icon';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { EntityService } from '../../services/entity.service';


@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule, MatSelectModule, MatIcon, FormBuilderComponent],
  template: `
    <div class="pt-4">
    <mat-form-field appearance="fill" class="w-full" *ngIf="!this.taskData">
      <mat-label>Select a Task Type</mat-label>
      <mat-select [(ngModel)]="newTaskType" (selectionChange)="onSelectTaskType($event.value)">
        <mat-option *ngFor="let task of tasks" [value]="task.value">
          <mat-icon class="mr-2">{{ task.icon }}</mat-icon>
          {{ task.label }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <app-form-builder *ngIf="newTaskType" [config]="taskFormConfig" (submitHandler)="submit($event)" [values]="values"></app-form-builder>
</div>
  `
})
export class TaskFormComponent implements OnInit{
  @Input() taskData:any = null;
  @Output() onSubmit = new EventEmitter<any>();
  entityService = inject(EntityService);
  fieldsService = inject(EntityFieldsService);

  values:any = {};
  newTaskType:TaskTypeT | null = null;
  taskFormConfig:FormConfig = {
    fields: [],
  }
  tasks = this.entityService.tasks;

  ngOnInit(): void {
    if(this.taskData){
      this.values = this.taskData.data;
      this.onSelectTaskType(this.taskData.type.value)
    }
  }

  getTaskFields(value: TaskTypeT | null): TaskItemI | undefined {
    return this.tasks.find(task => task.value === value);
  }

  onSelectTaskType(taskType:TaskTypeT){
    const task = this.getTaskFields(taskType);
    this.newTaskType = taskType;
    this.taskFormConfig = {
      title: !this.taskData ? task?.label : '',
      icon: !this.taskData ? task?.icon : '',
      fields: this.fieldsService.getTaskFields(taskType),
      submitText: this.taskData? 'Update Task' : 'Add Task'
    }
   //console.log(this.taskTypeFields[taskType]);
  }

  submit(taskData:any){   
    this.onSubmit.emit({
      type: this.getTaskFields(this.newTaskType),
      data: taskData
    });
  }


}
