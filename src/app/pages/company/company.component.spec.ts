import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CompanyComponent } from './company.component';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { DialogService } from '../../services/dialog.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ChartService } from '../../components/chart/chart.service';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;

  // Mock Services
  const mockEntityFieldsService = {
    companyFields: [],
    companyTabFields: { contacts: [] },
    getEntityFields: jasmine.createSpy().and.returnValue(of([])),
    buildEntityTableConfigColumns: jasmine.createSpy().and.returnValue([]),
  };

  const mockDataService = {
    getCompanies: jasmine.createSpy().and.returnValue(of([])),
    getDealsForCompany: jasmine.createSpy().and.returnValue(of([])),
    getAssetsForCompany: jasmine.createSpy().and.returnValue(of([])),
    addCompany: jasmine.createSpy().and.returnValue(of([])),
    updateCompany: jasmine.createSpy().and.returnValue(of([])),
    updateCompanyContacts: jasmine.createSpy().and.returnValue(of([])),
    deleteCompany: jasmine.createSpy().and.returnValue(of([])),
    deleteDeal: jasmine.createSpy().and.returnValue(of([])),
    updateCompanySection: jasmine.createSpy().and.returnValue(of([])),
  };

  const mockDialogService = {
    openTemplate: jasmine.createSpy(),
    openConfirm: jasmine.createSpy().and.returnValue(of(true)),
    closeAll: jasmine.createSpy(),
    closeDialogById: jasmine.createSpy(),
  };

  const mockSnackbarService = {
    showSnackbar: jasmine.createSpy(),
  };

  const mockChartService = {
    dealsToChartData: jasmine.createSpy().and.returnValue({ categories: [], series: [] }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyComponent],
      providers: [
        { provide: EntityFieldsService, useValue: mockEntityFieldsService },
        { provide: DataService, useValue: mockDataService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: ChartService, useValue: mockChartService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  // Initialization
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCompanies on init', () => {
    expect(mockDataService.getCompanies).toHaveBeenCalled();
  });

  it('should call getEntityFields on init', () => {
    expect(mockEntityFieldsService.getEntityFields).toHaveBeenCalledWith('company');
  });

  // Dialogs
  it('should open new company dialog', () => {
    component.openNewCompanyTmpl();
    expect(mockDialogService.openTemplate).toHaveBeenCalled();
  });

  it('should open deal dialog with correct header for new deal', () => {
    component.companyInfoValues = { companyName: 'Test Co' };
    const dealData = {};
    component.openDealDialog(dealData);
    expect(mockDialogService.openTemplate).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Add New Deal with Test Co',
      content: component.dealTmpl,
      panelClass: 'big-dialog',
      id: 'deal-dialog'
    }));
  });

  it('should open deal dialog with correct header for existing deal', () => {
    component.companyInfoValues = { companyName: 'Test Co' };
    const dealData = { id: 42 };
    component.openDealDialog(dealData);
    expect(mockDialogService.openTemplate).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Deal with Test Co'
    }));
  });

  // CRUD Operations
  it('should add a new company and close dialogs', () => {
    const formData = { companyName: 'Test Co' };
    component.addNewCompany(formData);
    expect(mockDataService.addCompany).toHaveBeenCalledWith(formData);
    expect(mockDialogService.closeAll).toHaveBeenCalled();
  });

  it('should show snackbar on update', () => {
    component.updateCompany({ companyName: 'Updated' });
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Company updated successfully');
  });

  it('should update company contacts and show snackbar', () => {
    component.companyInfoValues = { id: 10 };
    component.updateCompanyContacts({ contacts: ['John'] });
    expect(mockDataService.updateCompanyContacts).toHaveBeenCalledWith(10, ['John']);
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Company contacts updated successfully');
  });

  it('should update extra fields and show snackbar', () => {
    component.companyInfoValues = { id: 20 };
    component.updateCompanyExtraFields({ foo: 'bar' }, 'Finance');
    expect(mockDataService.updateCompanySection).toHaveBeenCalledWith(20, 'Finance', { foo: 'bar' });
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Company section "Finance" updated successfully');
  });

  // Deletion
  it('should delete company after confirmation', () => {
    const companyData = { id: 123, companyName: 'Test Co' };
    component.openConfirmDeleteCompany(companyData);
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
    expect(mockDataService.deleteCompany).toHaveBeenCalledWith(123);
    expect(mockSnackbarService.showSnackbar).toHaveBeenCalledWith('Company Test Co was deleted successfully');
  });

  it('should delete deal after confirmation', () => {
    const companyData = { id: 1, companyName: 'Test Co' };
    const dealData = { id: 2, dealName: 'Deal A' };
    component.deleteDeal(companyData, dealData);
    expect(mockDialogService.openConfirm).toHaveBeenCalled();
    expect(mockDataService.deleteDeal).toHaveBeenCalledWith(1, 2);
    expect(mockDialogService.closeDialogById).toHaveBeenCalledWith('deal-dialog');
  });

  // Tab Behavior
  it('should load deals and chart data on tab index 3', () => {
    component.companyInfoValues = { id: 1 };
    component.selectedTabChange({ index: 3 });
    expect(mockDataService.getDealsForCompany).toHaveBeenCalledWith(1);
    expect(mockChartService.dealsToChartData).toHaveBeenCalled();
  });

  it('should load assets on tab index 2', () => {
    component.companyInfoValues = { id: 1 };
    component.selectedTabChange({ index: 2 });
    expect(mockDataService.getAssetsForCompany).toHaveBeenCalledWith(1);
  });

  // Lifecycle
  it('should complete destroy$ on destroy', () => {
    const spy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
