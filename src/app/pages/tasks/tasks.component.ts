import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogService } from '../../services/dialog.service';
import { TaskColumnI, TaskI, TaskItemI } from './tasks.model';
import { MatSelectModule } from '@angular/material/select';
import { FormConfig } from '../../form-builder/form-builder.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PriorityWidgetComponent } from '../../components/priority-widget.component';
import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';



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
export class TasksComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @ViewChild('addTaskTmpl', { static: true }) addTaskTmpl!: TemplateRef<any>;

  private dialogService = inject(DialogService);
  private snackbarService = inject(SnackbarService);
  private dataService = inject(DataService);

  columns: TaskColumnI[] = [];

  newColumnTitle = '';
  newTaskType: string | null = null;
  taskFormConfig: FormConfig = {
    fields: []
  }

  selectedTaskData: any;
  selectedTaskPosition = {
    column: -1,
    row: -1
  }

  get connectedListIds(): string[] {
    return this.columns.map(c => 'list-' + c.id);
  }

  ngOnInit() {
    this.dataService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        if (tasks.length) {
          this.columns = tasks;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addColumn() {
    const title = this.newColumnTitle.trim();
    if (!title) return;
    this.columns = [...this.columns, { id: this.columns.length + 1, title, tasks: [] }];
    this.newColumnTitle = '';
  }

  private removeColumn(index: number) {
    //has to be empty!!!
    this.columns.splice(index, 1);
  }

  dropTask(event: CdkDragDrop<TaskI[]>) {
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

    this.dataService.updateTaskColumns(this.columns).subscribe(t => {
      this.snackbarService.showSnackbar('Tasks Updated');
    })
  }

  dropColumn(event: CdkDragDrop<any>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.dataService.updateTaskColumns(this.columns).subscribe(t => {
      this.snackbarService.showSnackbar('Tasks Updated');
      //console.log('Tasks Updated')
    })
  }

  confirmDeleteColumn(index: number) {
    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: 'Remove Column',
      content: `Are you sure you want to remove this column?`,
    }).subscribe(confirmed => {
      if (confirmed === true) {
        this.removeColumn(index);
        this.columns.splice(index, 1);
        this.dataService.updateTaskColumns(this.columns).subscribe(t => {
          this.snackbarService.showSnackbar('Tasks Updated');
        })
      }
    });
  }

  /******************** */

  openTaskDialog(task?: any) {
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

  onAfterSubmitTask(taskCols: any) {
    console.log('taskCols', taskCols);
    this.columns = taskCols;
  }

  removeTask(col: TaskColumnI, task: TaskI) {
    const idx = col.tasks.indexOf(task);
    if (idx > -1) col.tasks.splice(idx, 1);
  }

  openEditTaskDialog(task: any, selectedTaskPosition: any) {
    this.selectedTaskData = task;
    console.log(task);
    this.selectedTaskPosition = selectedTaskPosition;
    this.openTaskDialog(task);
  }

}
