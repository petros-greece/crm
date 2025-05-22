import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { EntityFieldsService, TaskTypeI } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { CommonModule } from '@angular/common';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  const mockTasks: TaskTypeI[] = [
    { id: '1', value: 'call', label: 'Call', icon: 'call' },
    { id: '2', value: 'email', label: 'Email', icon: 'email' }
  ];

  const mockEntityFieldsService = {
    getTaskTypeOptions: jasmine.createSpy().and.returnValue(of(mockTasks)),
    getTaskFieldsForType: jasmine.createSpy().and.returnValue(of([{ name: 'title', type: 'text' }]))
  };

  const mockDataService = {
    addOrUpdateTask: jasmine.createSpy().and.returnValue(of({ id: '123' }))
  };

  const mockSnackbarService = {
    showSnackbar: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        TaskFormComponent,
      ],
      providers: [
        { provide: EntityFieldsService, useValue: mockEntityFieldsService },
        { provide: DataService, useValue: mockDataService },
        { provide: SnackbarService, useValue: mockSnackbarService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
  });

  it('should load task types on init', () => {
    component.ngOnInit();
    expect(mockEntityFieldsService.getTaskTypeOptions).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  });

  it('should set config when task type is selected', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.onSelectTaskType('call');
    tick();
    expect(mockEntityFieldsService.getTaskFieldsForType).toHaveBeenCalledWith('call');
    expect(component.taskFormConfig.fields.length).toBe(1);
  }));

  it('should submit a new task', fakeAsync(() => {
    spyOn(component.onAfterSubmit, 'emit');

    component.taskType = 'email';
    component.tasks = mockTasks;
    component.onSelectTaskType('email');
    tick();

    const formData = { title: 'Follow up', assignee: 'John' };
    component.submit(formData);
    tick();

    expect(mockDataService.addOrUpdateTask).toHaveBeenCalled();
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Task added successfully');
    expect(component.onAfterSubmit.emit).toHaveBeenCalledWith({ id: '123' });
  }));

  it('should submit an existing task (update)', fakeAsync(() => {
    spyOn(component.onAfterSubmit, 'emit');

    component.taskData = {
      type: mockTasks[0],
      data: { title: 'Old Task', id: '123' }
    };
    component.ngOnInit();
    tick();

    const formData = { title: 'Updated Task', id: '123' };
    component.submit(formData);
    tick();

    expect(mockDataService.addOrUpdateTask).toHaveBeenCalled();
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Task updated successfully');
    expect(component.onAfterSubmit.emit).toHaveBeenCalledWith({ id: '123' });
  }));
});
