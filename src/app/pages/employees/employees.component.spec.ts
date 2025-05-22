import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesComponent } from './employees.component';
import { of, Subject } from 'rxjs';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { DialogService } from '../../services/dialog.service';
import { SnackbarService } from '../../services/snackbar.service';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  // Mocks
  let entityFieldsServiceMock: any;
  let dataServiceMock: any;
  let dialogServiceMock: any;
  let snackbarServiceMock: any;

  beforeEach(async () => {
    entityFieldsServiceMock = {
      employeeFields: [],
      getEntityFields: jasmine.createSpy().and.returnValue(of([])),
      buildEntityTableConfigColumns: jasmine.createSpy().and.returnValue([{ key: 'name', label: 'Name' }])
    };

    dataServiceMock = {
      getEmployees: jasmine.createSpy().and.returnValue(of([])),
      addEmployee: jasmine.createSpy().and.returnValue(of([])),
      updateEmployee: jasmine.createSpy().and.returnValue(of([])),
      deleteEmployee: jasmine.createSpy().and.returnValue(of([])),
      getTasksForEmployee: jasmine.createSpy().and.returnValue(of([])),
      deleteTask: jasmine.createSpy().and.returnValue(of([])),
      updateEmployeeSection: jasmine.createSpy().and.returnValue(of([]))
    };

    dialogServiceMock = {
      openTemplate: jasmine.createSpy(),
      openConfirm: jasmine.createSpy().and.returnValue(of(true)),
      closeAll: jasmine.createSpy(),
      closeDialogById: jasmine.createSpy()
    };

    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [EmployeesComponent],
      providers: [
        { provide: EntityFieldsService, useValue: entityFieldsServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize employee data and extra forms on init', () => {
    expect(dataServiceMock.getEmployees).toHaveBeenCalled();
    expect(entityFieldsServiceMock.getEntityFields).toHaveBeenCalledWith('employee');
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    const spy = spyOn((component as any).destroy$, 'next').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should open add employee dialog and configure form', () => {
    component.openNewEmployeeDialog();
    expect(dialogServiceMock.openTemplate).toHaveBeenCalled();
    expect(component.employeeFormConfig.submitText).toBe('Add');
  });

  it('should open edit employee dialog and get tasks', () => {
    const mockRow = { id: '1', fullName: 'John Doe' };
    component.openEditEmployeeDialog(mockRow);
    expect(component.employeeData).toEqual(mockRow);
    expect(dataServiceMock.getTasksForEmployee).toHaveBeenCalledWith('1');
    expect(dialogServiceMock.openTemplate).toHaveBeenCalled();
  });

  it('should add new employee', () => {
    component.tableConfig.data = [{ id: '1' }];
    const formData = { name: 'Jane' };
    component.addNewEmployee(formData);
    expect(dataServiceMock.addEmployee).toHaveBeenCalled();
  });

  it('should update employee', () => {
    component.employeeData = { id: '1', name: 'John' };
    component.updateEmployee({ name: 'John Doe' });
    expect(dataServiceMock.updateEmployee).toHaveBeenCalled();
  });

  it('should confirm and delete employee if no tasks', () => {
    component.tasksTableConfig.data = [];
    const mockEmployee = { id: '1', fullName: 'Test' };
    component.openConfirmDeleteEmployee(mockEmployee);
    expect(dialogServiceMock.openConfirm).toHaveBeenCalled();
    expect(dataServiceMock.deleteEmployee).toHaveBeenCalledWith('1');
  });

  it('should show snackbar if employee has tasks and delete is attempted', () => {
    component.tasksTableConfig.data = [{}]; // simulate tasks exist
    const mockEmployee = { id: '2', fullName: 'Busy Bee' };
    component.openConfirmDeleteEmployee(mockEmployee);
    expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(jasmine.stringContaining('reassign'));
  });

  it('should call dialog and update task table after task submit', () => {
    component.employeeData = { id: '1' };
    component.onAfterSubmitTask({});
    expect(dialogServiceMock.closeDialogById).toHaveBeenCalledWith('add-task-dialog');
    expect(dataServiceMock.getTasksForEmployee).toHaveBeenCalledWith('1');
  });

  it('should confirm and delete task', () => {
    component.employeeData = { id: '1' };
    const mockTask = { id: '101', subject: 'Test Task' };
    component.openConfirmDeleteTaskDialog(mockTask);
    expect(dialogServiceMock.openConfirm).toHaveBeenCalled();
    expect(dataServiceMock.deleteTask).toHaveBeenCalledWith('101');
  });
  
});
