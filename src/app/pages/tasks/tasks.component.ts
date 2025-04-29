import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogService } from '../../services/dialog.service';
import { TasksVarsComponent } from './tasks.vars';
import { TaskColumnI, TaskI, TaskItemI, TaskTypeT } from './tasks.model';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormBuilderComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent extends TasksVarsComponent {

  @ViewChild('addTaskTmpl', { static: true }) addTaskTmpl!: TemplateRef<any>;

  private dialogService = inject(DialogService);

  newColumnTitle = '';
  newTaskType:TaskTypeT | null = null;
  taskFormConfig:FormConfig = {
    fields: []
  }

  get connectedListIds(): string[] {
    return this.columns.map(c => 'list-' + c.id);
  }

  addColumn() {
    const title = this.newColumnTitle.trim();
    if (!title) return;
    this.columns.push({ id: new Date().getTime(), title, tasks: [] });
    this.newColumnTitle = '';
  }

  private removeColumn(index: number) {
    this.columns.splice(index, 1);
  }


  drop(event: CdkDragDrop<TaskI[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  confirmDeleteColumn(index: number) {
    this.dialogService.openConfirm({
      cls: 'bg-red-500',
      header: 'Add Task',
      content: 'Are you sure you want to remove this?',
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          this.removeColumn(index);
        }
      });
  }

  /******************** */

  getTaskFields(value: TaskTypeT | null): TaskItemI | undefined {
    return this.tasks.find(task => task.value === value);
  }
  
  
  onSelectTaskType(taskType:TaskTypeT){
    const task = this.getTaskFields(taskType);
    this.newTaskType = taskType;
    this.taskFormConfig = {
      title: task?.label || '',
      icon: task?.icon || '',
      fields: this.taskTypeFields[taskType],
      submitText: 'Add Task'
    }
   //console.log(this.taskTypeFields[taskType]);
  }

  addTask() {
    this.dialogService.openConfirm({
      panelClass: 'responsive-dialog',
      cls: 'bg-purple-500',
      header: 'Add Task',
      content: this.addTaskTmpl,
      showButtons: false
    })
      .subscribe(confirmed => {
        if (confirmed === true && this.newTaskType) {
          //this.columns[0].tasks.push({
           // id: new Date().getTime(),
           // type: this.getTaskFields(this.newTaskType),
           // data: taskData
          //})
        }
      });
  }

  addNewTask(taskData:any){
    const taskType = this.getTaskFields(this.newTaskType);
    this.columns[0].tasks.push({
      id: new Date().getTime(),
      type: taskType as TaskItemI,
      data: taskData
    })
  }

  removeTask(col: TaskColumnI, task: TaskI) {
    const idx = col.tasks.indexOf(task);
    if (idx > -1) col.tasks.splice(idx, 1);
  }

}
