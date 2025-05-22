import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingComponent } from './billing.component';
import { DataService } from '../../services/data.service';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartComponentWrapper } from '../../components/chart/chart.component';
import { TableBuilderComponent } from '../../table-builder/table-builder.component';

describe('BillingComponent', () => {
  let component: BillingComponent;
  let fixture: ComponentFixture<BillingComponent>;

  let dataServiceMock: any;
  let entityFieldsServiceMock: any;

  beforeEach(async () => {
    dataServiceMock = {
      getDeals: jasmine.createSpy().and.returnValue(of({
        '1': [{ dealValue: '100', revenueOrCost: 'revenue', dealTypeName: 'Type A' }],
        '2': [{ dealValue: '50', revenueOrCost: 'cost', dealTypeName: 'Type B' }]
      })),
      getCompanyOptions: jasmine.createSpy().and.returnValue(of([
        { id: '1', companyName: 'Company A' },
        { id: '2', companyName: 'Company B' }
      ]))
    };

    entityFieldsServiceMock = {
      buildEntityTableConfigColumns: jasmine.createSpy().and.returnValue([
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'dealValue', label: 'Deal Value', type: 'number' }
      ])
    };

    await TestBed.configureTestingModule({
      imports: [
        BillingComponent, // standalone component
        ChartComponentWrapper,
        TableBuilderComponent,
        CommonModule
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: EntityFieldsService, useValue: entityFieldsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart data and table config on init', () => {
    expect(dataServiceMock.getDeals).toHaveBeenCalled();
    expect(dataServiceMock.getCompanyOptions).toHaveBeenCalled();

    // Check table config
    expect(component.dealsTableConfig.data.length).toBeGreaterThan(0);
    expect(component.dealsTableConfig.columns.some(col => col.key === 'company')).toBeTrue();

    // Check chart data
    expect(component.totalChartData).toBeTruthy();
    expect(component.totalChartConfig?.chart?.type).toBe('bar');

    expect(component.totalPerCompanyChartData).toBeTruthy();
    expect(component.totalPerCompanyChartConfig?.chart?.type).toBe('bar');

    expect(component.totalPerDealTypeChartData).toBeTruthy();
    expect(component.totalPerDealTypeChartConfig?.chart?.type).toBe('treemap');
  });

  it('should cleanup on destroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const spy = spyOn(destroy$, 'next').and.callThrough();

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(destroy$.observers.length).toBe(0); // unsubscribed
  });
});
