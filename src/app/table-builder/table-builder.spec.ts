import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TableBuilderComponent, TableConfig } from './table-builder.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { XlsxService } from '../services/xlsx/xlsx.service';
import { OptionsService } from '../services/options.service';
import { DatePipe, CommonModule } from '@angular/common';

describe('TableBuilderComponent', () => {
  let component: TableBuilderComponent;
  let fixture: ComponentFixture<TableBuilderComponent>;
  let mockXlsxService: jasmine.SpyObj<XlsxService>;
  let mockOptionsService: jasmine.SpyObj<OptionsService>;

  const mockConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Name', type: 'text', sortable: true },
      { key: 'age', label: 'Age', type: 'number', sortable: false }
    ],
    data: [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 }
    ],
    pagination: false,
    hideButtons: true
  };

  beforeEach(async () => {
    mockXlsxService = jasmine.createSpyObj('XlsxService', ['exportTableToExcel', 'exportTableToJson']);
    mockOptionsService = jasmine.createSpyObj('OptionsService', ['getOption', 'updateOption']);

    await TestBed.configureTestingModule({
      imports: [
        TableBuilderComponent,
        NoopAnimationsModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatCheckboxModule,
        MatButtonModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        DatePipe,
        { provide: XlsxService, useValue: mockXlsxService },
        { provide: OptionsService, useValue: mockOptionsService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBuilderComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('initialized column visibility', () => {
    expect(component.columnVisibility).toEqual({ name: true, age: true });
  });

  it('should display table rows based on config data', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(2);
  });

  it('should NOT have pagination', (() => {
    const p = fixture.nativeElement.querySelectorAll('mat-paginator');
    expect(p.length).toBe(0);
  }));

  it('should NOT show buttons', fakeAsync(() => {
    const buttons = fixture.nativeElement.querySelectorAll('.table-btn-con button');
    expect(buttons.length).toBe(0);
  }));

  // it('should NOT have pagination', fakeAsync(() => {
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();
  //   const p = fixture.nativeElement.querySelectorAll('mat-paginator');
  //   expect(p.length).toBe(0);
  // }));

  // it('should have pagination', fakeAsync(() => {
  //   component.config.pagination = true;
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();
  //   const p = fixture.nativeElement.querySelectorAll('mat-paginator');
  //   expect(p.length).toBe(1);
  // }));

  // it('should NOT show buttons', fakeAsync(() => {
  //   component.config.hideButtons = true;
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();
  //   const buttons = fixture.nativeElement.querySelectorAll('.table-btn-con button');
  //   expect(buttons.length).toBe(0);
  // }));

  // it('should show 3 buttons', fakeAsync(() => {
  //   component.config.hideButtons = false;
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();
  //   const buttons = fixture.nativeElement.querySelectorAll('.table-btn-con button');
  //   expect(buttons.length).toBe(3);
  // }));

  it('should hide one column', (() => {
    const cells = fixture.nativeElement.querySelectorAll('td');
    expect(cells.length).toBe(4);
    component.columnVisibility = { name: true, age: false };
    component.updateDisplayedColumns();
    const cellsAfter = fixture.nativeElement.querySelectorAll('td');
    expect(cellsAfter.length).toBe(2);
  }));

  // it('should show no data message if data is empty', fakeAsync(() => {
  //   component.config.data = [];
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();
  //   const msg = fixture.nativeElement.querySelector('h2');
  //   expect(msg.textContent).toContain('No data available');
  // }));


  // it('should call exportTableToExcel when Excel button is clicked', fakeAsync(() => {
  //   component.config.hideButtons = false;
  //   fixture.detectChanges();
  //   tick();
  //   fixture.detectChanges();

  //   const button = fixture.nativeElement.querySelector('.mat-button');
  //  // console.log(button.length)
  //   expect(button).toBeTruthy();
  //   button.click();
  //   expect(mockXlsxService.exportTableToExcel).toHaveBeenCalled();
  // }));



  //mat-paginator

  // it('should display table rows based on config data', async () => {
  //   fixture.detectChanges();  
  //   await fixture.whenStable();  
  //   fixture.detectChanges();  
  //   const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');

  //   expect(rows.length).toBe(2);
  // });

  // it('should display columns based on config visibility', () => {
  //   expect(component.displayedColumns).toEqual(['name', 'age']);
  // });

  // it('should call exportTableToExcel when Excel button is clicked', async () => {
  //   component.config.hideButtons = false;
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   fixture.detectChanges();

  //   const button = fixture.nativeElement.querySelector('button');
  //   console.log(fixture.nativeElement)
  //   expect(button).toBeTruthy();

  //   button.click();
  //   expect(mockXlsxService.exportTableToExcel).toHaveBeenCalled();
  // });



});
