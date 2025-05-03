import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { FormConfig } from '../../form-builder/form-builder.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PriorityWidgetComponent } from '../../components/priority-widget.component';



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
    TaskFormComponent,
    PriorityWidgetComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent extends TasksVarsComponent implements OnInit{

  @ViewChild('addTaskTmpl', { static: true }) addTaskTmpl!: TemplateRef<any>;

  private dialogService = inject(DialogService);
  
  newColumnTitle = '';
  newTaskType:TaskTypeT | null = null;
  taskFormConfig:FormConfig = {
    fields: []
  }

  selectedTaskData:any;
  selectedTaskPosition = {
    column: -1,
    row: -1
  }

  get connectedListIds(): string[] {
    return this.columns.map(c => 'list-' + c.id);
  }

  ngOnInit(){
    this.dataService.getTasks().subscribe(tasks=>{
      if(tasks.length){
        this.columns = tasks;
      }
    })
  }

  addColumn() {
    const title = this.newColumnTitle.trim();
    if (!title) return;
    this.columns.push({ id: new Date().getTime(), title, tasks: [] });
    this.newColumnTitle = '';
  }

  private removeColumn(index: number) {
    //has to be empty!!!
    this.columns.splice(index, 1);
  }

  drop(event: CdkDragDrop<TaskI[]>) {
    console.log(event);
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

    this.dataService.updateTaskColumns(this.columns).subscribe(t=>{
      console.log('Tasks Updated')
    })
  }

  dropColumn(event: CdkDragDrop<any>){
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
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

  openTaskDialog(task?:any) {
    task ? null : this.selectedTaskData = null;
    this.dialogService.openConfirm({
      panelClass: 'responsive-dialog',
      cls: 'bg-violet-800 !text-white',
      header: task ? `${task.type.label}` : 'Add Task',
      content: this.addTaskTmpl,
      showButtons: false,
      icon: task ? task.type.icon : ''
    });
  }

  addOrUpdateTask(taskData:any){
    console.log('taskData', taskData);
    if(!taskData.data.id){
      const task = {
        data: { ...taskData.data, id: new Date().getTime() },
        type: taskData.type
      };
      this.columns[0].tasks.push(task);
      this.dataService.updateTaskColumns(this.columns).subscribe(t=>{
        console.log('Tasks Updated')
      })
    }
    else{
      //this.dataService.updateTask(taskData).subscribe(t=>{
       // debugger
       // const info = this.selectedTaskIndex;
       const p = this.selectedTaskPosition;
       this.columns[p.column].tasks[p.row] = taskData; 
       this.dataService.updateTaskColumns(this.columns).subscribe(t=>{
        console.log('Tasks Updated')
      })    
     // })     
    }
    
  }

  removeTask(col: TaskColumnI, task: TaskI) {
    const idx = col.tasks.indexOf(task);
    if (idx > -1) col.tasks.splice(idx, 1);
  }

  openEditTaskDialog(task:any, selectedTaskPosition:any){
    this.selectedTaskData = task;
    this.selectedTaskPosition = selectedTaskPosition;
    this.openTaskDialog(task);
  }

}
