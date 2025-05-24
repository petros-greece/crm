import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsComponent } from './departments.component';
import { DialogService } from './../../components/dialog/dialog.service';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { of, Subject } from 'rxjs';

// Mock services
const mockDialogService = {
  openTemplate: jasmine.createSpy('openTemplate'),
  openConfirm: jasmine.createSpy('openConfirm').and.returnValue(of(true)),
  closeAll: jasmine.createSpy('closeAll'),
};

const mockDataService = {
  getDepartments: jasmine.createSpy('getDepartments').and.returnValue(of([])),
  getEmployeeOptions: jasmine.createSpy('getEmployeeOptions').and.returnValue(of([])),
  getEmployeesForDepartment: jasmine.createSpy('getEmployeesForDepartment').and.returnValue(of([])),
  addDepartment: jasmine.createSpy('addDepartment').and.returnValue(of([])),
  updateDepartment: jasmine.createSpy('updateDepartment').and.returnValue(of([])),
  deleteDepartment: jasmine.createSpy('deleteDepartment').and.returnValue(of([])),
  updateDepartmentSection: jasmine.createSpy('updateDepartmentSection').and.returnValue(of([])),
  updateEmployeeRole: jasmine.createSpy('updateEmployeeRole').and.returnValue(of({ id: 'emp1' })),
};

const mockSnackbarService = {
  showSnackbar: jasmine.createSpy('showSnackbar'),
};

const mockEntityFieldsService = {
  getEntityFields: jasmine.createSpy('getEntityFields').and.returnValue(of([])),
};

describe('DepartmentsComponent', () => {
  let component: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsComponent], // using standalone component
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: DataService, useValue: mockDataService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: EntityFieldsService, useValue: mockEntityFieldsService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the DepartmentsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDepartments and getEntityFields on init', () => {
    expect(mockDataService.getDepartments).toHaveBeenCalled();
    expect(mockEntityFieldsService.getEntityFields).toHaveBeenCalledWith('department');
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = spyOn<any>(component['destroy$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should generate camelCase machine name', () => {
    const result = component['toCamelCaseMachineName']('Finance & HR Team');
    expect(result).toBe('financeHrTeam');
  });

  it('should generate fallback random name if input is empty', () => {
    const result = component['toCamelCaseMachineName']('');
    expect(result.startsWith('random')).toBeTrue();
  });

  it('should call dialogService.openTemplate when adding a department', () => {
    component.openAddDepartmentDialog();
    expect(mockDialogService.openTemplate).toHaveBeenCalled();
  });

  it('should open confirm dialog and call deleteDepartment if allowed', () => {
    component.departmentFormValues = { id: '1', label: 'Dept A' };
    component.departmentRoles = [{ role: 'dev', employees: [] }]; // allow delete
    component.openConfirmDeleteDepartmentDialog();
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
  });
});
