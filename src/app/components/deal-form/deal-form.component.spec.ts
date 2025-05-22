import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealFormComponent } from './deal-form.component';
import { of } from 'rxjs';
import { EntityFieldsService, DealTypeI } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { FormFieldConfig } from '../../form-builder/form-builder.model';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

describe('DealFormComponent', () => {
  let component: DealFormComponent;
  let fixture: ComponentFixture<DealFormComponent>;

  const mockDealTypes: DealTypeI[] = [
    {
      id: 'type1',
      label: 'Type One',
      value: 'type-one',
      icon: 'star',
      relations: ['partner', 'vendor']
    },
    {
      id: 'type2',
      label: 'Type Two',
      value: 'type-one',
      icon: 'work',
      relations: ['client']
    }
  ];

  const mockFields: FormFieldConfig[] = [
    { name: 'amount', label: 'Amount', type: 'number' }
  ];

  const entityFieldsServiceMock = {
    getDealTypeOptions: jasmine.createSpy().and.returnValue(of(mockDealTypes)),
    getDealFieldsForType: jasmine.createSpy().and.returnValue(of(mockFields))
  };

  const dataServiceMock = {
    addDeal: jasmine.createSpy().and.returnValue(of({ success: true })),
    updateDeal: jasmine.createSpy().and.returnValue(of({ success: true }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealFormComponent],
      providers: [
        provideHttpClient(),
        { provide: EntityFieldsService, useValue: entityFieldsServiceMock },
        { provide: DataService, useValue: dataServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DealFormComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter deal types based on company relations on init', () => {
    component.companyInfo = { relations: ['partner'] };
    fixture.detectChanges();

    expect(entityFieldsServiceMock.getDealTypeOptions).toHaveBeenCalled();
    expect(component.dealTypes.length).toBe(1);
    expect(component.dealTypes[0].id).toBe('type1');
  });

  it('should load form fields if dealFormValues.dealType is provided', () => {
    component.companyInfo = { relations: ['client'] };
    component.dealFormValues = { id: '123', dealType: 'type2' };

    fixture.detectChanges();

    expect(entityFieldsServiceMock.getDealFieldsForType).toHaveBeenCalledWith('type2');
    expect(component.dealFormConfig.fields.length).toBeGreaterThan(0);
  });

  it('should update form config on deal type selection', () => {
    component.originalDealTypes = mockDealTypes;
    component.onSelectDealType('type1');

    expect(entityFieldsServiceMock.getDealFieldsForType).toHaveBeenCalledWith('type1');
    expect(component.dealFormConfig.title).toBe('Type One');
  });

  it('should call addDeal and emit onAfterSubmitDeal for new deal', () => {
    spyOn(component.onAfterSubmitDeal, 'emit');
    component.companyInfo = { id: 'c1' };
    component.dealTypes = mockDealTypes;
    component.selectedDealType = 'type1';

    const formData = {
      name: 'New Deal',
      dealType: 'type1',
      id: null
    };

    component.submitDeal(formData);

    expect(dataServiceMock.addDeal).toHaveBeenCalled();
    expect(component.onAfterSubmitDeal.emit).toHaveBeenCalledWith({ success: true });
  });

  it('should call updateDeal and emit onAfterSubmitDeal for existing deal', () => {
    spyOn(component.onAfterSubmitDeal, 'emit');
    component.companyInfo = { id: 'c1' };

    const formData = {
      id: 'd123',
      name: 'Existing Deal',
      dealType: 'type2'
    };

    component.submitDeal(formData);

    expect(dataServiceMock.updateDeal).toHaveBeenCalled();
    expect(component.onAfterSubmitDeal.emit).toHaveBeenCalledWith({ success: true });
  });

  it('should render select dropdown if dealFormValues.id is not present', () => {
    component.companyInfo = { relations: ['partner'] };
    component.dealFormValues = { id: null };

    fixture.detectChanges();
    const selectField = fixture.debugElement.query(By.css('mat-form-field'));
    expect(selectField).toBeTruthy();
  });

  it('should render form builder if selectedDealType is set', () => {
    component.companyInfo = { relations: ['vendor'] };
    component.dealFormValues = { id: null };
    component.selectedDealType = 'type1';
    component.dealFormConfig = { fields: mockFields, title: '', icon: '', submitText: 'Submit' };

    fixture.detectChanges();

    const formBuilder = fixture.debugElement.query(By.css('app-form-builder'));
    expect(formBuilder).toBeTruthy();
  });
});
