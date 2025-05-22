import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { of, Subject } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskColumnI, TaskI } from './tasks.model';
import { TemplateRef } from '@angular/core';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openConfirm']);
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);
    mockDataService = jasmine.createSpyObj('DataService', ['getTasks', 'updateTaskColumns']);

    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on init', () => {
    const mockTasks: TaskColumnI[] = [
      { id: 1, title: 'Todo', tasks: [] }
    ];
    mockDataService.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges(); // triggers ngOnInit
    expect(mockDataService.getTasks).toHaveBeenCalled();
    expect(component.columns).toEqual(mockTasks);
  });

  it('should add a column', () => {
    component.columns = [];
    component.newColumnTitle = 'New Column';
    component.addColumn();
    expect(component.columns.length).toBe(1);
    expect(component.columns[0].title).toBe('New Column');
  });

  it('should not add column if title is empty', () => {
    component.columns = [];
    component.newColumnTitle = ' ';
    component.addColumn();
    expect(component.columns.length).toBe(0);
  });

  it('should remove column from columns', () => {
    (component as any).removeColumn(0);
    expect(component.columns.length).toBe(0);
  });

  it('should update task order within the same column', () => {
    const column: TaskI[] = [{ type: 'A' } as TaskI, { type: 'B' } as TaskI];
    const event: CdkDragDrop<TaskI[]> = {
      previousIndex: 0,
      currentIndex: 1,
      previousContainer: { data: column } as any,
      container: { data: column } as any
    } as any;

    mockDataService.updateTaskColumns.and.returnValue(of(true));
    component.columns = [{ id: 1, title: 'Column', tasks: column }];
    component.dropTask(event);
    expect(mockDataService.updateTaskColumns).toHaveBeenCalled();
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalled();
  });

  it('should update task order between columns', () => {
    const task = { type: 'Task' } as TaskI;
    const source = [task];
    const target: TaskI[] = [];

    const event: CdkDragDrop<TaskI[]> = {
      previousIndex: 0,
      currentIndex: 0,
      previousContainer: { data: source } as any,
      container: { data: target } as any
    } as any;

    mockDataService.updateTaskColumns.and.returnValue(of(true));
    component.columns = [
      { id: 1, title: 'Col1', tasks: source },
      { id: 2, title: 'Col2', tasks: target }
    ];
    component.dropTask(event);
    expect(target[0]).toEqual(task);
    expect(source.length).toBe(0);
    expect(mockDataService.updateTaskColumns).toHaveBeenCalled();
  });

  it('should confirm and delete column', () => {
    mockDialogService.openConfirm.and.returnValue(of(true));
    mockDataService.updateTaskColumns.and.returnValue(of(true));

    component.columns = [{ id: 1, title: 'Col', tasks: [] }];
    component.confirmDeleteColumn(0);
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
    expect(component.columns.length).toBe(0);
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalled();
  });

  it('should not delete column if user cancels', () => {
    mockDialogService.openConfirm.and.returnValue(of(false));
    component.columns = [{ id: 1, title: 'Col', tasks: [] }];
    component.confirmDeleteColumn(0);
    expect(component.columns.length).toBe(1);
  });

  it('should open a task dialog', () => {
    component.addTaskTmpl = {} as TemplateRef<any>;
    component.openTaskDialog({ type: { label: 'Test', icon: 'icon' } });
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
  });

  it('should remove a task from column', () => {
    const task = { type: 'Task' } as TaskI;
    const col: TaskColumnI = { id: 1, title: 'Col', tasks: [task] };
    component.removeTask(col, task);
    expect(col.tasks.length).toBe(0);
  });

  it('should set task data for editing', () => {
    const task = { name: 'Task', type: { label: 'Label', icon: 'icon' } };
    const pos = { column: 1, row: 2 };
    component.addTaskTmpl = {} as TemplateRef<any>;
    component.openEditTaskDialog(task, pos);
    expect(component.selectedTaskData).toBe(task);
    expect(component.selectedTaskPosition).toEqual(pos);
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = spyOn((component as any).destroy$, 'next').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
